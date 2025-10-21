// 黒背景に白の線画で「奥へ伸びる路地」を描くSVG
// ・左/右の路肩ラインが消失点へ収束
// ・中央の破線レーン
// ・左右の建物の輪郭線（抽象）
// ・街灯の光点（奥に行くほど小さく）＋淡い発光
// ※色は props で変更可（デフォ白）。動きを抑えた微小な発光のみ。

"use client";
import { memo, useMemo } from "react";

type Props = {
  stroke?: string;        // ライン色
  glow?: string;          // 街灯グロー色
  vpX?: number;           // 消失点X(0〜1000)
  vpY?: number;           // 消失点Y(0〜600)
  className?: string;
};

export default memo(function StreetlineBG({
  stroke = "#FFFFFF",
  glow = "rgba(255, 255, 255, 0.9)",
  vpX = 500,
  vpY = 160,
  className = "",
}: Props) {

  // 画面基準の寸法
  const W = 1000, H = 600;
  const roadBottomY = H;

  // 直線補間
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // 路肩ライン（左右）
  const leftEdge = { x1: 120, y1: roadBottomY, x2: vpX, y2: vpY };
  const rightEdge = { x1: W - 120, y1: roadBottomY, x2: vpX, y2: vpY };

  // 街灯の配置（左右の路肩に沿って等間隔・遠くほど小さく）
  const lamps = useMemo(() => {
    const arr: Array<{ x: number; y: number; r: number }> = [];
    const count = 10; // 手前→奥
    for (let i = 0; i < count; i++) {
      const t = i / (count - 0.5); // 0→1（少し手前寄りに）
      // 左
      arr.push({
        x: lerp(leftEdge.x1, leftEdge.x2, t),
        y: lerp(leftEdge.y1, leftEdge.y2, t),
        r: lerp(5, 1.2, t),
      });
      // 右
      arr.push({
        x: lerp(rightEdge.x1, rightEdge.x2, t),
        y: lerp(rightEdge.y1, rightEdge.y2, t),
        r: lerp(5, 1.2, t),
      });
    }
    return arr;
  }, [vpX, vpY]);

  // 建物の輪郭（抽象的な縦ライン＋段差）左右それぞれ
  const buildingLines = useMemo(() => {
    const lines: Array<{ x: number; y1: number; y2: number }> = [];
    // 左側
    [40, 70, 95, 140, 170, 190].forEach((x, i) => {
      lines.push({ x, y1: H - 30 - i * 8, y2: 220 + i * 5 });
    });
    // 右側
    [W - 40, W - 70, W - 95, W - 140, W - 170, W - 190].forEach((x, i) => {
      lines.push({ x, y1: H - 26 - i * 8, y2: 230 + i * 5 });
    });
    return lines;
  }, []);

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full block"
        role="img"
        aria-label="Night street line-art background"
      >
        {/* 背景 */}
        <rect x="0" y="0" width={W} height={H} fill="#0C0C0F" />

        {/* 遠方の淡い粒子（ごく薄） */}
        <g opacity="0.18">
          {[...Array(60)].map((_, i) => {
            const x = Math.random() * W;
            const y = Math.random() * (H * 0.5);
            return <circle key={i} cx={x} cy={y} r={Math.random() * 1.2} fill={stroke} />;
          })}
        </g>

        {/* 路肩ライン（左右） */}
        <g stroke={stroke} strokeOpacity="0.8" strokeWidth="1.2">
          <line x1={leftEdge.x1} y1={leftEdge.y1} x2={leftEdge.x2} y2={leftEdge.y2} />
          <line x1={rightEdge.x1} y1={rightEdge.y1} x2={rightEdge.x2} y2={rightEdge.y2} />
        </g>

        {/* 中央の破線（遠近感を出すため間隔を狭→広） */}
        <g stroke={stroke} strokeOpacity="0.55" strokeWidth="1">
          {Array.from({ length: 14 }).map((_, i) => {
            const t = i / 14;
            const y1 = lerp(roadBottomY - 12, vpY + 20, t);
            const y2 = y1 - lerp(24, 10, t);
            const x = vpX;
            return <line key={i} x1={x} y1={y1} x2={x} y2={y2} />;
          })}
        </g>

        {/* 建物の輪郭（抽象） */}
        <g stroke={stroke} strokeOpacity="0.35" strokeWidth="1">
          {buildingLines.map((l, i) => (
            <line key={i} x1={l.x} y1={l.y1} x2={l.x} y2={l.y2} />
          ))}
          {/* 簡易の看板横棒 */}
          {buildingLines.slice(1, 5).map((l, i) => (
            <line
              key={`h-${i}`}
              x1={l.x - (i % 2 ? 20 : 30)}
              y1={l.y2 + 18}
              x2={l.x + (i % 2 ? 26 : 34)}
              y2={l.y2 + 18}
            />
          ))}
        </g>

        {/* 街灯（点光）：微小な発光（CSSで柔らかく） */}
        <g>
          {lamps.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.r} fill={glow} opacity="0.95" />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r * 3.2}
                fill="none"
                stroke={glow}
                strokeOpacity="0.25"
                strokeWidth="0.6"
                className="animate-pulse-light"
              />
            </g>
          ))}
        </g>

        {/* 消失点のほのかなグロー */}
        <radialGradient id="vpGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.18" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <circle cx={vpX} cy={vpY} r="120" fill="url(#vpGlow)" />
      </svg>

      {/* 発光パルス（CSS） */}
      <style jsx>{`
        @keyframes pulseLight {
          0%, 100% { opacity: .22; }
          50% { opacity: .38; }
        }
        .animate-pulse-light {
          animation: pulseLight 3.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-light { animation: none; }
        }
      `}</style>
    </div>
  );
});
