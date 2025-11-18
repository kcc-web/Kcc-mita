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
  const [videoState, setVideoState] = useState<'loading' | 'playing' | 'error' | 'fallback'>('loading');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // モバイル判定
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const touchPoints = navigator.maxTouchPoints > 0;
      return mobileKeywords.test(userAgent) || touchPoints;
    };

    setIsMobile(checkMobile());

    const video = videoRef.current;
    if (!video) return;

    let playAttempts = 0;
    const maxAttempts = 3;

    // 動画再生を試みる関数
    const attemptPlay = async () => {
      if (!video || playAttempts >= maxAttempts) {
        setVideoState('fallback');
        return;
      }

      try {
        playAttempts++;
        
        // モバイルの場合は特別な処理
        if (isMobile) {
          // モバイルでは画質を下げて再生を優先
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.muted = true;
          video.defaultMuted = true;
          video.autoplay = true;
        }

        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setVideoState('playing');
          console.log('Video playing successfully');
        }
      } catch (error) {
        console.error(`Play attempt ${playAttempts} failed:`, error);
        
        // 再試行
        if (playAttempts < maxAttempts) {
          setTimeout(attemptPlay, 1000);
        } else {
          setVideoState('fallback');
        }
      }
    };

    // 動画の各種イベントハンドラー
    const handleLoadedData = () => {
      console.log('Video data loaded');
      attemptPlay();
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      if (videoState !== 'playing') {
        attemptPlay();
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      setVideoState('error');
    };

    const handleStalled = () => {
      console.log('Video stalled');
      // ネットワークが遅い場合は画像にフォールバック
      setTimeout(() => {
        if (videoState === 'loading') {
          setVideoState('fallback');
        }
      }, 5000);
    };

    const handlePlaying = () => {
      setVideoState('playing');
    };

    const handlePause = () => {
      // 意図しない一時停止の場合は再開を試みる
      if (!document.hidden && videoState === 'playing') {
        setTimeout(() => {
          video.play().catch(() => {
            console.log('Resume failed');
          });
        }, 100);
      }
    };

    // ユーザーインタラクションで再生を試みる（モバイル対策）
    const handleUserInteraction = () => {
      if (video.paused && videoState !== 'fallback') {
        attemptPlay();
      }
    };

    // イベントリスナー登録
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);

    // モバイルでのユーザーインタラクション対応
    if (isMobile) {
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      document.addEventListener('click', handleUserInteraction, { once: true });
    }

    // タブ切り替え対応
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused && videoState === 'playing') {
        attemptPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 初回読み込みタイムアウト（10秒で諦める）
    const loadTimeout = setTimeout(() => {
      if (videoState === 'loading') {
        console.log('Video load timeout, falling back to image');
        setVideoState('fallback');
      }
    }, 10000);

    // クリーンアップ
    return () => {
      clearTimeout(loadTimeout);
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('pause', handlePause);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (isMobile) {
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('click', handleUserInteraction);
      }
    };
  }, [isMobile, videoState]);

  // デバッグ情報を表示（開発時のみ）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Video state:', videoState);
      console.log('Is mobile:', isMobile);
    }
  }, [videoState, isMobile]);

  const showVideo = videoState !== 'fallback' && videoState !== 'error';

  return (
    <main className="relative">
      {/* ========== 1. Hero Section ========== */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0">
          {/* 常に画像を背景として配置（フォールバック兼初期表示） */}
          <Image
            src="/images/about/hero.jpg"
            alt="KCC Hero"
            fill
            className="object-cover"
            priority
          />

          {/* 動画オーバーレイ（条件付き表示） */}
          {showVideo && (
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                preload={isMobile ? "metadata" : "auto"}
                poster="/images/about/hero.jpg"
                style={{ 
                  // モバイルでのフルスクリーン対策
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              >
                <source 
                  src="/videos/about-hero.webm" 
                  type="video/webm"
                />
                <source 
                  src="/videos/about-hero.mp4" 
                  type="video/mp4"
                />
              </video>
            </div>
          )}

          {/* 黒グラデーションのオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

          {/* デバッグ情報（開発時のみ） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
              State: {videoState} | Mobile: {isMobile ? 'Yes' : 'No'}
            </div>
          )}
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