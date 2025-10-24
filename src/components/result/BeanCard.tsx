"use client";

import KccCard from "@/components/kcc/KccCard";
import FlavorBadge from "@/components/menu/FlavorBadge";
import { Badge } from "@/components/ui/badge";

type BeanCardProps = {
  imageSrc: string;   // 画像URL（ResultClient側で決定したもの）
  typeName: string;   // "The Dreamer"
  beanName: string;   // "Ethiopia Natural"
  desc: string;       // 説明文
  tags: string[];     // ["Bright","Sweet","Fruity"]
  onClick?: () => void; // クリックハンドラ（任意）
};

export default function BeanCard({
  imageSrc,
  typeName,
  beanName,
  desc,
  tags,
  onClick,
}: BeanCardProps) {
  return (
    <KccCard
      title={typeName}
      description={desc}
      image={{ src: imageSrc, alt: beanName, ratio: "16/9", priority: true }}
      onClick={onClick}
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-md text-xs">{beanName}</Badge>
          {tags.map((t) => (
            <FlavorBadge key={t} text={t} />
          ))}
        </div>
      }
      className="rounded-2xl cursor-pointer"
    />
  );
}
