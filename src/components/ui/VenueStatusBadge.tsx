"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';

type VenueStatus = 'available' | 'moderate' | 'crowded';

type VenueData = {
  status: VenueStatus;
  location: string;
  shortLocation: string;
  hours: string;
  waitTime: string;
  lastUpdated: Date;
};

type StatusConfig = {
  color: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  icon: string;
  mainText: string;
  subText: string;
  pulse: boolean;
};

const VenueStatusBadge = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // 診断中（/quiz ページ）の判定
  const isDiagnosing = pathname === '/quiz' || 
    (pathname?.startsWith('/quiz/') && !pathname?.includes('/intro'));
  
  // サンプルデータ（実際はAPIから取得）
  const [venueData, setVenueData] = useState<VenueData>({
    status: 'moderate',
    location: '慶應義塾大学 三田キャンパス',
    shortLocation: 'KCC三田',
    hours: '10:00-18:00',
    waitTime: '5-10分',
    lastUpdated: new Date()
  });

  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusConfig = (status: VenueStatus): StatusConfig => {
    switch(status) {
      case 'available':
        return {
          color: 'bg-green-500',
          bgGradient: 'from-green-50 to-green-100',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: '🟢',
          mainText: 'すぐにご案内できます ☕️',
          subText: 'お待たせせずにご提供中です',
          pulse: false
        };
      case 'moderate':
        return {
          color: 'bg-yellow-500',
          bgGradient: 'from-yellow-50 to-orange-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          icon: '🟡',
          mainText: '少し賑わってます ☕️',
          subText: `まもなくご案内（${venueData.waitTime}）`,
          pulse: true
        };
      case 'crowded':
        return {
          color: 'bg-red-500',
          bgGradient: 'from-red-50 to-orange-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          icon: '🔴',
          mainText: '多くのお客様にご利用中 ☕️',
          subText: '香りを楽しみながらお待ちください',
          pulse: true
        };
      default:
        return {
          color: 'bg-gray-500',
          bgGradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          icon: '⚫',
          mainText: '準備中',
          subText: '',
          pulse: false
        };
    }
  };

  const statusConfig = getStatusConfig(venueData.status);

  // リアルタイム更新のシミュレーション（本番では削除してAPI接続）
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: VenueStatus[] = ['available', 'moderate', 'crowded'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setVenueData(prev => ({
        ...prev,
        status: randomStatus,
        lastUpdated: new Date()
      }));
    }, 30000); // 30秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // /access ページへの遷移
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      router.push('/access');
    }
  };

  // 診断中は非表示
  if (isDiagnosing) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* メインバッジ */}
      <div
        onClick={handleClick}
        className={`
          relative cursor-pointer select-none
          bg-gradient-to-br ${statusConfig.bgGradient}
          backdrop-blur-md bg-opacity-95
          border ${statusConfig.borderColor}
          rounded-2xl shadow-lg
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl
          ${isExpanded ? 'w-80' : 'w-auto max-w-xs'}
        `}
      >
        {/* パルスエフェクト */}
        {statusConfig.pulse && (
          <div className="absolute inset-0 rounded-2xl">
            <div className={`absolute inset-0 rounded-2xl ${statusConfig.color} opacity-20 animate-pulse`} />
          </div>
        )}

        <div className="relative p-3 px-4">
          {/* コンパクト表示 */}
          {!isExpanded && (
            <div className="flex items-center gap-3">
              {/* ステータスインジケーター */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{statusConfig.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${statusConfig.textColor}`}>
                    {statusConfig.mainText}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-0.5">
                    {statusConfig.subText}
                  </span>
                </div>
              </div>

              {/* 場所と時間 */}
              <div className="flex items-center gap-2 border-l pl-3 border-gray-300">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-gray-500" />
                    <span className="text-[10px] font-medium text-gray-700">
                      {venueData.shortLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-500" />
                    <span className="text-[10px] font-medium text-gray-700">
                      {venueData.hours}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight size={16} className="text-gray-400 ml-1" />
            </div>
          )}

          {/* 展開表示 */}
          {isExpanded && (
            <div className="space-y-3">
              {/* ヘッダー */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{statusConfig.icon}</span>
                  <span className={`font-bold ${statusConfig.textColor}`}>
                    {statusConfig.mainText}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* 詳細情報 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-gray-500" />
                  <span className="text-gray-700">{venueData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-gray-700">本日 {venueData.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-500" />
                  <span className="text-gray-700">{statusConfig.subText}</span>
                </div>
              </div>

              {/* アクションボタン */}
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg border border-gray-200 transition-colors">
                詳細を見る →
              </button>

              {/* 最終更新 */}
              <div className="text-center text-[10px] text-gray-400">
                最終更新: {venueData.lastUpdated.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueStatusBadge;