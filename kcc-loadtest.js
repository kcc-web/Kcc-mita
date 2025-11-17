import http from "k6/http";
import { check, sleep, group } from "k6";

// =======================
// 基本設定
// =======================

// 環境変数 BASE_URL があればそれを優先（ローカル / プレビューでも使える）
const BASE_URL = __ENV.BASE_URL || "https://kcc-mita.vercel.app";

export const options = {
  scenarios: {
    // ① ホームだけ見る軽いシナリオ（ウォームアップ兼ねて）
    home_smoke: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 20 }, // 20ユーザーまで増やす
        { duration: "20s", target: 20 }, // 20ユーザー維持
        { duration: "10s", target: 0 },  // 減らして終了
      ],
      exec: "homeFlow",
      gracefulRampDown: "10s",
      gracefulStop: "10s",
    },

    // ② メインの負荷テスト（最大300人想定）
    quiz_peak_300: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 }, // まず100人まで増やす
        { duration: "60s", target: 300 }, // 300人まで増やして1分キープ
        { duration: "30s", target: 0 },   // 減らして終了
      ],
      exec: "quizFlow",
      gracefulRampDown: "30s",
      gracefulStop: "30s",
    },
  },

  thresholds: {
    // 300人テストなので、p95 が 3秒以内なら一応許容とみなす
    http_req_duration: ["p(95) < 3000"],
    // 404も混ざるので、本気で見るまでは http_req_failed のしきい値は外しておく
    // "http_req_failed{expected_response:true}": ["rate<0.01"],
  },
};

// =======================
// ユーティリティ
// =======================

// ちょっとだけ人間っぽい待ち時間を入れる
function randomSleep(min = 0.5, max = 1.5) {
  const t = min + Math.random() * (max - min);
  sleep(t);
}

// ランダムな診断タイプ（/result?type=... 用のダミー）
const RESULT_TYPES = [
  "classic",
  "balancer",
  "seeker",
  "dreamer",
  "adventurer",
  "pioneer",
];

function randomResultType() {
  return RESULT_TYPES[Math.floor(Math.random() * RESULT_TYPES.length)];
}

// =======================
// シナリオ1: ホームだけ見る人
// =======================

export function homeFlow() {
  group("Home", () => {
    const res = http.get(`${BASE_URL}/`, { tags: { name: "GET /" } });

    check(res, {
      "home status 200": (r) => r.status === 200,
    });

    randomSleep();
  });
}

// =======================
// シナリオ2: 診断フローを通る人（ページ遷移のみ）
// =======================

export function quizFlow() {
  // 1. トップページ
  group("Home", () => {
    const res = http.get(`${BASE_URL}/`, { tags: { name: "GET /" } });

    check(res, {
      "home status 200": (r) => r.status === 200,
    });

    randomSleep();
  });

  // 2. 診断イントロ
  group("Quiz Intro", () => {
    const res = http.get(`${BASE_URL}/quiz/intro`, {
      tags: { name: "GET /quiz/intro" },
    });

    check(res, {
      "intro status 200": (r) => r.status === 200,
    });

    randomSleep();
  });

  // 3. 診断ページ本体
  group("Quiz Page", () => {
    const res = http.get(`${BASE_URL}/quiz`, {
      tags: { name: "GET /quiz" },
    });

    check(res, {
      "quiz status 200": (r) => r.status === 200,
    });

    randomSleep();
  });

  // ★ 4. 診断結果ページ（API POST はまだ入れず、ページ表示だけテスト）
  group("Result Page", () => {
    const type = randomResultType();

    const res = http.get(`${BASE_URL}/result?type=${type}`, {
      tags: { name: "GET /result" },
    });

    check(res, {
      "result status 200/404": (r) => r.status === 200 || r.status === 404,
    });

    randomSleep();
  });

  // 5. おまけで他ページも巡回（存在しないときは 404 も許容）
  group("Browse Other Pages", () => {
    const pages = ["/menu", "/events", "/cafes"];

    pages.forEach((path) => {
      const res = http.get(`${BASE_URL}${path}`, {
        tags: { name: `GET ${path}` },
      });

      check(res, {
        [`${path} status 200/404`]: (r) => r.status === 200 || r.status === 404,
      });

      sleep(0.3);
    });
  });
}
