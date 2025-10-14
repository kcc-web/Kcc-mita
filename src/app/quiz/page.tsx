// src/app/quiz/page.tsx
"use client";

import QuizClient from "./QuizClient";

// 毎回 /quiz/intro から入る運用なので Cookie 制御は不要。
// Heroから「診断を始める ☕️」→ /quiz に遷移して診断が開始される。
export default function QuizPage() {
  return <QuizClient />;
}



