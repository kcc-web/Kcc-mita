// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Utensils } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-12">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          KCC Mita 2025
        </h1>
        <p className="text-muted-foreground mt-2">
          QRから来たら、まずは診断かメニューへ👇
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-xl">
        <Link href="/quiz" className="w-full">
          <Button className="w-full h-12 text-base">
            <Coffee className="mr-2 h-5 w-5" aria-hidden="true" />
            MBTI診断へ
          </Button>
        </Link>

        <Link href="/menu" className="w-full">
          <Button variant="secondary" className="w-full h-12 text-base">
            <Utensils className="mr-2 h-5 w-5" aria-hidden="true" />
            メニューを見る
          </Button>
        </Link>
      </section>
    </main>
  );
}
