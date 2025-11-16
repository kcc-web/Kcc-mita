"use client";

import KccCard from "@/components/kcc/KccCard";
import FlavorBadge from "@/components/menu/FlavorBadge";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";

type BeanCardProps = {
  imageSrc: string;
  typeName: string;
  beanName: string;
  desc: string;
  tags: string[];
  characterImageSrc?: string;
  onClick?: () => void;
};

export default function BeanCard({
  imageSrc,
  typeName,
  beanName,
  desc,
  tags,
  characterImageSrc,
  onClick,
}: BeanCardProps) {
  return (
    <div className="space-y-6">
      {/* キャラクター画像（大きく表示） */}
      {characterImageSrc && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-square sm:aspect-[3/4] md:aspect-[4/5] max-w-md mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-amber-50 shadow-xl border-2 border-pink-100"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
          <Image
            src={characterImageSrc}
            alt={`${typeName}のキャラクター`}
            fill
            className="object-contain p-6 sm:p-8"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 28rem"
            priority
          />
          
          {/* キャラクター名のバッジ */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-pink-200 px-4 py-2 shadow-lg">
              <span className="text-sm font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
                {typeName}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* コーヒー豆情報カード */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <KccCard
          title={typeName}
          description={desc}
          image={{ src: imageSrc, alt: beanName, ratio: "16/9", priority: false }}
          onClick={onClick}
          footer={
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-md text-xs font-semibold bg-gradient-to-r from-pink-500 to-amber-500 text-white border-0">
                {beanName}
              </Badge>
              {tags.map((t) => (
                <FlavorBadge key={t} text={t} />
              ))}
            </div>
          }
          className="rounded-2xl cursor-pointer hover:shadow-xl transition-shadow duration-300"
        />
      </motion.div>
    </div>
  );
}