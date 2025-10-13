"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  title: string;
  description?: string;
  image: {
    src: string;
    alt: string;
    ratio?: "16/9" | "4/5" | "1/1";
    priority?: boolean;
  };
  footer?: React.ReactNode; // タグ・価格・日付など
  className?: string;
  onClick?: () => void;     // ← ここでクリック対応
};

const ratioToClass: Record<NonNullable<Props["image"]["ratio"]>, string> = {
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

export default function KccCard({
  href,
  title,
  description,
  image,
  footer,
  className,
  onClick,
}: Props) {
  const isLink = typeof href === "string" && href.length > 0;
  const Wrapper: any = isLink ? Link : "button";
  const wrapperProps = isLink ? { href } : { type: "button", onClick };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn("group", className)}
    >
        
      <Wrapper {...wrapperProps} className="block w-full text-left focus:outline-none">
        <Card className="rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-primary/60">
          {/* 画像ボックス（relative必須／fill配置） */}
          <div className={cn("relative overflow-hidden rounded-xl", ratioToClass[image.ratio ?? "16/9"])}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={image.priority ?? false}
            />
          </div>

          <CardContent className="p-4 md:p-5">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            {footer && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {footer}
              </div>
            )}
          </CardContent>
        </Card>
      </Wrapper>
    </motion.div>
  );
}

