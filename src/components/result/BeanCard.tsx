"use client";

import KccCard from "@/components/kcc/KccCard";
import FlavorBadge from "@/components/menu/FlavorBadge";
// shadcn/ui を使っていない場合は下行をコメントアウトして、下の <span> 版に切り替えてください
import { Badge } from "@/components/ui/badge";

type BeanCardProps = {
  imageSrc: string;   // 画像URL（ResultClient側で決定したもの）
  typeName: string;   // "The Dreamer"
  beanName: string;   // "Ethiopia Natural"
  desc: string;       // 説明文
  tags: string[];     // ["Bright","Sweet","Fruity"]
};

export default function BeanCard({
  imageSrc,
  typeName,
  beanName,
  desc,
  tags,
}: BeanCardProps) {
  return (
    <KccCard
      title={typeName}
      description={desc}
      image={{ src: imageSrc, alt: beanName, ratio: "16/9", priority: true }}
      footer={
        <div className="flex flex-wrap items-center gap-2">
          {/* shadcn Badge が無ければ、下の <span> に置換 */}
          <Badge className="rounded-md text-xs">{beanName}</Badge>
          {/* <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs">
            {beanName}
          </span> */}
          {tags.map((t) => (
            <FlavorBadge key={t} text={t} />
          ))}
        </div>
      }
      className="rounded-2xl"
    />
  );
}
