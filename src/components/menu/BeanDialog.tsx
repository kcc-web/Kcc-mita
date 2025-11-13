"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Coffee, MapPin, Mountain, Leaf, Droplets, Award } from "lucide-react";
import BeanRadar from "./BeanRadar";
import type { MenuBean } from "@/lib/menu";

export default function BeanDialog({
  open, onOpenChange, bean,
}: { open: boolean; onOpenChange: (v: boolean) => void; bean: MenuBean | null; }) {
  if (!bean) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl flex items-center gap-2 flex-wrap">
            <Coffee className="h-6 w-6 flex-shrink-0" /> 
            {bean.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 flex-shrink-0" /> 
            {bean.origin}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 価格と焙煎者 */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-800 font-bold text-lg">
              {bean.price}
            </span>
            {bean.roaster && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                <Coffee className="h-3.5 w-3.5 mr-1.5" />
                {bean.roaster}
              </span>
            )}
            {bean.roastLevel && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                {bean.roastLevel}
              </span>
            )}
            {bean.stock === "limited" && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 text-sm font-semibold">
                <Award className="h-3.5 w-3.5 mr-1.5" />
                数量限定
              </span>
            )}
          </div>

          {/* 説明文 */}
          {bean.description && (
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {bean.description}
            </p>
          )}

          {/* Taste Note（フレーバーノート） */}
          {bean.tasteNote && bean.tasteNote.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-pink-50 to-orange-50 p-4 border border-pink-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-pink-600" />
                Taste Note
              </h3>
              <div className="flex flex-wrap gap-2">
                {bean.tasteNote.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-white text-gray-800 text-xs font-medium shadow-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Profile情報（2カラムグリッド） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bean.producer && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <Coffee className="h-3.5 w-3.5" />
                  Producer
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.producer}</div>
              </div>
            )}
            {bean.farm && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Farm
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.farm}</div>
              </div>
            )}
            {bean.region && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Region
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.region}</div>
              </div>
            )}
            {bean.altitude && bean.altitude !== "-" && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <Mountain className="h-3.5 w-3.5" />
                  Altitude
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.altitude}</div>
              </div>
            )}
            {bean.variety && bean.variety.length > 0 && bean.variety[0] !== "-" && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5" />
                  Variety
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.variety.join(", ")}</div>
              </div>
            )}
            {bean.process && bean.process !== "-" && (
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />
                  Process
                </div>
                <div className="text-sm font-medium text-gray-900">{bean.process}</div>
              </div>
            )}
          </div>

          {/* レーダーチャート */}
          <div className="rounded-xl bg-white border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-pink-600" />
              Flavor Profile
            </h3>
            <BeanRadar data={bean.radar} />
            
            {/* レーダーチャート説明 */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px] text-gray-500">
                <div className="flex items-start gap-1.5">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span><span className="font-medium text-gray-600">酸味：</span>高いほど酸味が強い</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span><span className="font-medium text-gray-600">甘味：</span>高いほど甘味が強い</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span><span className="font-medium text-gray-600">口当たり：</span>高いほどまろやか</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span><span className="font-medium text-gray-600">香り：</span>高いほど香りが強い</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-pink-400 mt-0.5">•</span>
                  <span><span className="font-medium text-gray-600">余韻：</span>高いほど余韻が長い</span>
                </div>
              </div>
            </div>
          </div>

          {/* フッター注釈 */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            ※ フレーバープロファイルは焙煎度や抽出方法により変化します
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}