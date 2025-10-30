// app/about/AboutClient.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  Heart,
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

function IconBadge({ name }: { name: string }) {
  const common = "h-5 w-5";
  const map: Record<string, React.ReactElement> = {
    coffee: <Coffee className={common} />,
    mapPin: <MapPin className={common} />,
    star: <Star className={common} />,
    calendar: <Calendar className={common} />,
    users: <Users className={common} />,
    sparkles: <Sparkles className={common} />,
  };
  return map[name] ?? <Sparkles className={common} />;
}

export type Activity = {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  tags: string[];
};

export default function AboutClient({ activities }: { activities: Activity[] }) {
  return (
    <main className="relative">
      {/* ========== 1. Hero Section ========== */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/hero.jpg"
            alt="KCC members brewing coffee"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-white px-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block">コーヒーで、</span>
              <span className="block mt-2">つながる・つくる・伝える。</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light tracking-wide opacity-90">
              慶應珈琲倶楽部 - Keio Coffee Club
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ========== 2. Introduction ========== */}
      <section className="py-16 md:py-20 px-6 md:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            慶應珈琲倶楽部とは？
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            私たちは日吉キャンパスを拠点に活動する、コーヒーを愛する学生サークルです。
            <br className="hidden md:block" />
            焙煎・抽出の技術向上から、イベント企画、文化交流まで多角的に活動し、
            <br className="hidden md:block" />
            「コーヒー」という共通言語を通じて、人と人をつなぐ場を創造しています。
          </p>
        </motion.div>
      </section>

      {/* ========== 3. Mission / Vision ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-pink-50/50 via-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 md:gap-12"
          >
            <div className="group">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  コーヒーを通じて人と人をつなぎ、
                  <br />
                  日常に小さな幸せと発見をもたらす
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                  Vision
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  慶應から日本全体へ、
                  <br />
                  文化としてのコーヒーを広げる
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== 4. Activities ========== */}
      <section className="py-16 md:py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Activities
          </h2>
          <p className="text-lg text-muted-foreground">
            多彩な活動を通じて、コーヒーの魅力を探求しています
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <IconBadge name={activity.icon} />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-pink-600 transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              一緒にコーヒーの世界を探求しませんか？
            </h2>
            <p className="text-lg text-white/90">
              新メンバー募集中！コーヒー初心者も大歓迎です
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                見学申し込み
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/" // 公式SNSに差し替え
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors"
              >
                SNSをフォロー
                <Heart className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

