"use client";

import { Badge } from "@/components/ui/badge";

type BeanCardProps = {
  typeName: string;           // The Dreamer など
  beanName: string;           // Ethiopia Natural など
  desc: string;               // 2-3行説明
  tags: string[];             // ["Bright","Sweet","Fruity"]
};

export default function BeanCard({ typeName, beanName, desc, tags }: BeanCardProps) {
  return (
    <article className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold">{typeName}</h3>
        <span className="text-xs rounded-md border px-2 py-0.5">{beanName}</span>
      </div>
      <p className="text-sm md:text-base text-muted-foreground leading-7 mb-3">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
        ))}
      </div>
    </article>
  );
}
