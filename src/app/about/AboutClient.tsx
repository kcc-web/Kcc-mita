"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Coffee,
  Heart,
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Star,
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVideoError, setIsVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // 動画を強制的に再生する関数
    const forcePlayVideo = async () => {
      try {
        // 動画の状態をリセット
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA以上
          await video.play();
        } else {
          // データが足りない場合は再読み込み
          video.load();
          // loadeddata イベントを待って再生
          video.addEventListener('loadeddata', async () => {
            try {
              await video.play();
            } catch (e) {
              console.log('Play after reload failed:', e);
            }
          }, { once: true });
        }
      } catch (error) {
        console.log('Force play failed:', error);
        // モバイルブラウザなどで自動再生がブロックされた場合
        // ユーザーインタラクションを待つ
      }
    };

    // IntersectionObserverで画面内判定（より積極的に）
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 画面に入ったらすぐ再生
            forcePlayVideo();
          }
        });
      },
      {
        threshold: 0, // 1ピクセルでも見えたら反応
        rootMargin: '100px', // 画面に入る100px手前から準備開始
      }
    );

    observer.observe(section);

    // ページ表示時の処理
    const handlePageShow = (event: PageTransitionEvent) => {
      // バックフォワードキャッシュから復帰した場合も含む
      if (!event.persisted) {
        forcePlayVideo();
      }
    };

    // タブのアクティブ状態を監視
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        forcePlayVideo();
      }
    };

    // フォーカスイベント
    const handleFocus = () => {
      forcePlayVideo();
    };

    // スクロールイベント（ユーザーが操作している証拠）
    let scrollTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        // スクロールが止まったら動画の状態をチェック
        if (video.paused && !document.hidden) {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            forcePlayVideo();
          }
        }
      }, 150);
    };

    // 動画のイベントハンドラー
    const handleCanPlay = () => {
      forcePlayVideo();
    };

    const handleStalled = () => {
      console.log('Video stalled, reloading...');
      video.load();
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setIsVideoError(true);
    };

    // 定期的なチェック（最後の手段）
    const intervalId = setInterval(() => {
      if (video.paused && !document.hidden) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          console.log('Interval check: restarting video');
          forcePlayVideo();
        }
      }
    }, 5000); // 5秒ごとにチェック

    // イベントリスナー登録
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('scroll', handleScroll, { passive: true });
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('error', handleError);

    // 初回再生
    forcePlayVideo();

    // クリーンアップ
    return () => {
      observer.unobserve(section);
      clearInterval(intervalId);
      clearTimeout(scrollTimer);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('scroll', handleScroll);
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <main className="relative">
      {/* ========== 1. Hero Section （動画版） ========== */}
      <section ref={sectionRef} className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* 背景動画/画像 */}
        <div className="absolute inset-0">
          {!isVideoError ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto" // autoに変更してより積極的に読み込み
              poster="/images/about/hero.jpg"
            >
              <source src="/videos/about-hero.webm" type="video/webm" />
              <source src="/videos/about-hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/images/about/hero.jpg"
              alt="KCC Hero"
              fill
              className="object-cover"
              priority
            />
          )}

          {/* 黒グラデーションのオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        {/* テキスト */}
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

        {/* スクロール誘導 */}
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
            慶應珈琲倶楽部とは?
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
      <section className="py-20 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            Activities
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            多彩な活動を通じて、コーヒーの魅力を探求しています
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {activities.map((activity: Activity, index: number) => (
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
                    {activity.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-amber-50 text-gray-700 text-xs font-medium border border-pink-100"
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

        {/* エレガントな締めくくり */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center pt-8 border-t border-gray-200"
        >
          <p className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
            コーヒーと共に、豊かな時間を。
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            Keio Coffee Club
          </p>
        </motion.div>
      </section>
    </main>
  );
}