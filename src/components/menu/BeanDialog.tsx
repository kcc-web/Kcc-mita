"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Coffee, MapPin, Utensils } from "lucide-react";
import BeanRadar from "./BeanRadar";
import type { Bean } from "@/types/bean";

export default function BeanDialog({
  open, onOpenChange, bean,
}: { open: boolean; onOpenChange: (v: boolean) => void; bean: Bean | null; }) {
  if (!bean) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Coffee size={20} /> {bean.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin size={16} /> {bean.origin}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-sm">
            {bean.elevation && <div>標高：{bean.elevation}</div>}
            {!!bean.variety?.length && <div>品種：{bean.variety.join(", ")}</div>}
            <div className="mt-1">フレーバー：{bean.flavor.join(" / ")}</div>
          </div>

          <BeanRadar data={bean.radar} />

          <div className="text-xs opacity-70 flex items-center gap-2">
            <Utensils size={14} /> ワッフルと好相性
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
