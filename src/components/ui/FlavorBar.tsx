"use client";

type FlavorBarProps = {
  title: string;            // e.g. "Brightness"
  left: string;             // e.g. "Bright"
  right: string;            // e.g. "Deep"
  value: number;            // 0..100
  gradient?: "brightness" | "sweetness" | "texture" | "aroma";
};

const GRADIENT: Record<NonNullable<FlavorBarProps["gradient"]>, string> = {
  brightness: "from-yellow-400 via-orange-400 to-rose-400",
  sweetness:  "from-pink-400 via-rose-400 to-fuchsia-400",
  texture:    "from-zinc-300 via-neutral-400 to-zinc-600",
  aroma:      "from-violet-400 via-purple-400 to-orange-400",
};

export default function FlavorBar({ title, left, right, value, gradient="brightness" }: FlavorBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{pct}%</div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
        <span>{left}</span><span>{right}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
        <div
          className={`h-full bg-gradient-to-r ${GRADIENT[gradient]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
