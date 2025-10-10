"use client";

type StepDotsProps = {
  total: number;
  active: number;           // 0-based
  answered?: boolean[];     // 回答済みフラグ
  onJump?: (i: number) => void;
};

export function StepDots({ total, active, answered = [], onJump }: StepDotsProps) {
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const done = answered[i] === true;
        const classes = [
          "h-2.5 rounded-full transition-all",
          done ? "bg-foreground/90" : "bg-muted",
          i === active
            ? "outline outline-2 outline-offset-2 outline-foreground scale-[1.05]"
            : "hover:opacity-90",
        ].join(" ");

        return onJump ? (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={classes}
            aria-label={`設問 ${i + 1} へ`}
            aria-current={i === active ? "step" : undefined}
          />
        ) : (
          <div
            key={i}
            className={classes}
            aria-hidden={i !== active}
          />
        );
      })}
    </div>
  );
}

