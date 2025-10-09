"use client";
import { Badge } from "@/components/ui/badge";

export default function FlavorBadge({ text }: { text: string }) {
  return <Badge variant="secondary" className="rounded-full">{text}</Badge>;
}
