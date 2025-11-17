"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Clock, Navigation, Info, Train, Users, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { composeCopy, pickColors } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  available: "空いてる",
  moderate: "やや混雑",
  crowded: "混雑",
};

export default function AccessClient() {
  const supabase = useMemo(() => createClient(), []);
  const [venue, setVenue] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const { data: venueData } = await supabase
          .from("venue")
          .select("*")
          .limit(1)
          .single();

        const { data: settingsData } = await supabase
          .from("settings")
          .select("*")
          .eq("id", 1)
          .single();

        setVenue(venueData);
        if (settingsData) {
          setSettings({
            ...settingsData,
            colors: pickColors(settingsData),
          });
        }
      } catch (error) {
        console.error("Failed to fetch venue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [supabase]);

  const copy = venue && settings ? composeCopy(venue, settings) : null;
  const pal =
    venue && settings
      ? venue.status === "available"
        ? settings.colors.available
        : venue.status === "moderate"
        ? settings.colors.moderate
        : settings.colors.crowded
      : null;

  const statusLabel = venue ? STATUS_LABEL[venue.status] || "不明" : "読込中";

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-white">
      {/* ========== Hero Section ========== */}
      <section className="relative py-16 md:py-20 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm mb-4">
              <MapPin className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-medium text-pink-900 tracking-wide">Access Information</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                アクセス
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              慶應義塾大学 三田キャンパス<br className="sm:hidden" />
              第一校舎133教室へのご案内
            </p>
          </motion.div>

          {/* ========== 現在の混雑状況カード ========== */}
          {!loading && venue && settings && pal && copy && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-12"
            >
              <div
                className="rounded-2xl border-2 p-6 md:p-8 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${pal.bgFrom}, ${pal.bgTo})`,
                  borderColor: pal.border,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-4 w-4 rounded-full animate-pulse shadow-lg"
                    style={{ backgroundColor: pal.dot }}
                  />
                  <h2 className="text-2xl font-bold" style={{ color: pal.text }}>
                    現在の混雑状況
                  </h2>
                </div>

                <div className="space-y-2">
                  <p className="text-3xl md:text-4xl font-bold" style={{ color: pal.text }}>
                    {statusLabel}
                  </p>
                  <p className="text-lg md:text-xl font-medium" style={{ color: pal.text }}>
                    {copy.main}
                  </p>
                  <p className="text-sm md:text-base opacity-80" style={{ color: pal.text }}>
                    {copy.sub}
                  </p>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm" style={{ color: pal.text }}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">営業時間：{venue.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{venue.short_location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== キャンパス全体図 ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-2xl border-2 border-pink-200 bg-white overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-4 md:p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <MapPin className="h-6 w-6 md:h-7 md:w-7" />
                  キャンパスマップ
                </h2>
              </div>

              <div className="p-4 md:p-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <Image
                    src="/access/campus-map.jpg"
                    alt="三田キャンパス全体図"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-900">第一校舎</strong>は正門から入ってすぐ左手の建物です。
                      1階エントランスから入り、階段で上がってください。
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========== 第一校舎の写真 ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-2xl border-2 border-pink-200 bg-white overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-4 md:p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Navigation className="h-6 w-6 md:h-7 md:w-7" />
                  第一校舎 133教室
                </h2>
              </div>

              <div className="p-4 md:p-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <Image
                    src="/access/building-1.jpg"
                    alt="第一校舎の外観"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-500">
                    <h3 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      教室への行き方
                    </h3>
                    <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
                      <li>第一校舎の1階エントランスから入る</li>
                      <li>階段を上がって3階へ</li>
                      <li>廊下を進み、133教室の看板を探す</li>
                      <li>到着！スタッフがお出迎えします</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>
                        迷われた場合は、お近くのスタッフまたは案内所にお声がけください。
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========== 電車でのアクセス ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-2xl border-2 border-pink-200 bg-white overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-4 md:p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <Train className="h-6 w-6 md:h-7 md:w-7" />
                  電車でお越しの方
                </h2>
              </div>

              <div className="p-4 md:p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 都営線 */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <h3 className="font-bold text-gray-900">都営地下鉄三田線・浅草線</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>三田駅</strong>（A3出口）から徒歩7分
                    </p>
                    <p className="text-xs text-gray-600">
                      赤羽橋方面へ向かい、慶應仲通り商店街を通って正門へ
                    </p>
                  </div>

                  {/* JR線 */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h3 className="font-bold text-gray-900">JR山手線・京浜東北線</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>田町駅</strong>（西口）から徒歩8分
                    </p>
                    <p className="text-xs text-gray-600">
                      第一京浜（国道15号）を札の辻方面へ、慶應通りを右折
                    </p>
                  </div>

                  {/* 大江戸線 */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-pink-500" />
                      <h3 className="font-bold text-gray-900">都営大江戸線</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>赤羽橋駅</strong>（赤羽橋口）から徒歩8分
                    </p>
                    <p className="text-xs text-gray-600">
                      桜田通りを三田方面へ進み、慶應通りを左折
                    </p>
                  </div>

                  {/* 南北線 */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-teal-500" />
                      <h3 className="font-bold text-gray-900">東京メトロ南北線</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>麻布十番駅</strong>（7番出口）から徒歩10分
                    </p>
                    <p className="text-xs text-gray-600">
                      桜田通りを三田方面へ直進、慶應通りを左折
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========== 注意事項 ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                ご来場前にご確認ください
              </h2>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>混雑時はお待ちいただく場合がございます。ページ上部の混雑状況をご確認ください。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>三田祭期間中はキャンパス内が混雑します。お時間に余裕を持ってお越しください。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>教室内での飲食は可能です。ごゆっくりお過ごしください。</span>
                 </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>お支払いは現金のみとなります。ご了承ください。</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}