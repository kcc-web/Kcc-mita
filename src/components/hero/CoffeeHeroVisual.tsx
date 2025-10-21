"use client";
import dynamic from "next/dynamic";
import COFFEE from "../../../public/animations/coffee.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CoffeeHeroVisual() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-64 h-64 md:w-80 md:h-80">
        <Lottie
          animationData={COFFEE}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        />
      </div>

      {/* ← "coffee の下に" 見せたいコピー */}
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">Keio Coffee Club</p>
        <p className="text-[15px] md:text-base">
          <span className="bg-gradient-to-r from-rose-400 to-amber-500 bg-clip-text text-transparent">
            日常を彩る、一杯のコーヒー
          </span>
        </p>
      </div>
    </div>
  );
}
