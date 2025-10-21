"use client";
import { memo, useMemo } from "react";

interface StreetlineBGProps {
  stroke?: string;
  glow?: string;
  vpX?: number;
  vpY?: number;
  className?: string;
}

function StreetlineBGComponent({
  stroke = "#FFFFFF",
  glow = "rgba(255, 255, 255, 0.9)",
  vpX = 500,
  vpY = 160,
  className = "",
}: StreetlineBGProps) {
  const W = 1000, H = 600;
  const roadBottomY = H;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // 路肩ライン
  const leftEdge = { x1: 120, y1: roadBottomY, x2: vpX, y2: vpY };
  const rightEdge = { x1: W - 120, y1: roadBottomY, x2: vpX, y2: vpY };

  // 街灯（より多く、より目立つ）
  const lamps = useMemo(() => {
    const arr: Array<{ x: number; y: number; r: number; opacity: number }> = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 0.5);
      const opacity = 1 - t * 0.7;
      // 左
      arr.push({
        x: lerp(leftEdge.x1, leftEdge.x2, t),
        y: lerp(leftEdge.y1, leftEdge.y2, t),
        r: lerp(6, 1.5, t),
        opacity,
      });
      // 右
      arr.push({
        x: lerp(rightEdge.x1, rightEdge.x2, t),
        y: lerp(rightEdge.y1, rightEdge.y2, t),
        r: lerp(6, 1.5, t),
        opacity,
      });
    }
    return arr;
  }, [vpX, vpY, leftEdge.x1, leftEdge.y1, leftEdge.x2, leftEdge.y2, rightEdge.x1, rightEdge.y1, rightEdge.x2, rightEdge.y2]);

  // 建物の輪郭（より密度高く）
  const buildingLines = useMemo(() => {
    const lines: Array<{ x: number; y1: number; y2: number; opacity: number }> = [];
    // 左側
    [30, 50, 75, 95, 120, 145, 165, 185, 200].forEach((x, i) => {
      lines.push({
        x,
        y1: H - 20 - i * 12,
        y2: 180 + i * 8,
        opacity: 0.3 + Math.random() * 0.3,
      });
    });
    // 右側
    [W - 30, W - 50, W - 75, W - 95, W - 120, W - 145, W - 165, W - 185, W - 200].forEach((x, i) => {
      lines.push({
        x,
        y1: H - 18 - i * 12,
        y2: 190 + i * 8,
        opacity: 0.3 + Math.random() * 0.3,
      });
    });
    return lines;
  }, []);

  // 窓の光
  const windows = useMemo(() => {
    const wins: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let i = 0; i < 40; i++) {
      wins.push({
        x: Math.random() * 200 + (Math.random() > 0.5 ? 20 : W - 220),
        y: Math.random() * 350 + 150,
        w: 8 + Math.random() * 6,
        h: 12 + Math.random() * 8,
      });
    }
    return wins;
  }, []);

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full block"
        role="img"
        aria-label="Night cityscape background"
      >
        {/* 背景 */}
        <rect x="0" y="0" width={W} height={H} fill="#0C0C0F" />

        {/* 遠方の星空 */}
        <g opacity="0.25">
          {[...Array(100)].map((_, i) => {
            const x = Math.random() * W;
            const y = Math.random() * (H * 0.4);
            const r = Math.random() * 1.5;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill={stroke}
                className="animate-twinkle"
                style={{ animationDelay: `${Math.random() * 3}s` }}
              />
            );
          })}
        </g>

        {/* 路肩ライン（太く） */}
        <g stroke={stroke} strokeOpacity="0.9" strokeWidth="2">
          <line x1={leftEdge.x1} y1={leftEdge.y1} x2={leftEdge.x2} y2={leftEdge.y2} />
          <line x1={rightEdge.x1} y1={rightEdge.y1} x2={rightEdge.x2} y2={rightEdge.y2} />
        </g>

        {/* 中央の破線（より目立つ） */}
        <g stroke={stroke} strokeOpacity="0.7" strokeWidth="1.5">
          {Array.from({ length: 18 }).map((_, i) => {
            const t = i / 18;
            const y1 = lerp(roadBottomY - 12, vpY + 20, t);
            const y2 = y1 - lerp(30, 12, t);
            return <line key={i} x1={vpX} y1={y1} x2={vpX} y2={y2} />;
          })}
        </g>

        {/* 建物の輪郭 */}
        <g stroke={stroke} strokeWidth="1">
          {buildingLines.map((l, i) => (
            <line key={i} x1={l.x} y1={l.y1} x2={l.x} y2={l.y2} strokeOpacity={l.opacity} />
          ))}
        </g>

        {/* 窓の光 */}
        <g fill={glow} opacity="0.4">
          {windows.map((w, i) => (
            <rect
              key={i}
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              rx="1"
              className="animate-flicker"
              style={{ animationDelay: `${Math.random() * 4}s` }}
            />
          ))}
        </g>

        {/* 街灯の光 */}
        <g>
          {lamps.map((p, i) => (
            <g key={i} opacity={p.opacity}>
              <circle cx={p.x} cy={p.y} r={p.r} fill={glow} />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.r * 4}
                fill="none"
                stroke={glow}
                strokeOpacity="0.3"
                strokeWidth="0.8"
                className="animate-pulse-slow"
              />
            </g>
          ))}
        </g>

        {/* 消失点の光 */}
        <radialGradient id="vpGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <circle cx={vpX} cy={vpY} r="150" fill="url(#vpGlow2)" />
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-flicker {
          animation: flicker 4s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-twinkle,
          .animate-flicker,
          .animate-pulse-slow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

const StreetlineBG = memo(StreetlineBGComponent);
StreetlineBG.displayName = "StreetlineBG";

export default StreetlineBG;