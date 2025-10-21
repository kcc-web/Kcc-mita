// src/lib/venueTheme.ts
export type VenueStatus = 'available' | 'moderate' | 'crowded';

export type VenueData = {
  status: VenueStatus;
  location: string;      // 例: 慶應義塾大学 三田キャンパス
  shortLocation: string; // 例: KCC三田
  hours: string;         // 例: 10:00-18:00
  waitTime: string;      // 例: 5-10分
};

export type Palette = {
  // 16進カラー（#xxxxxx）。バッジは CSS 変数で着色します。
  bgFrom: string;   // グラデ左
  bgTo: string;     // グラデ右
  text: string;
  border: string;
  dot: string;      // 丸インジケータ
  pulse?: string;   // パルス色（省略可）
};

export type VenueConfig = {
  palette: Record<VenueStatus, Palette>;
  copy: {
    available: { main: string; sub: string };
    moderate:  { main: string; subPrefix: string }; // 例: "まもなくご案内（{wait}）"
    crowded:   { main: string; sub: string };
  };
};

export const DEFAULT_VENUE_DATA: VenueData = {
  status: 'moderate',
  location: '慶應義塾大学 三田キャンパス',
  shortLocation: 'KCC三田',
  hours: '10:00-18:00',
  waitTime: '5-10分',
};

export const DEFAULT_CONFIG: VenueConfig = {
  palette: {
    available: {
      bgFrom: '#F0FFF4',
      bgTo:   '#E6FFFA',
      text:   '#065F46',
      border: '#A7F3D0',
      dot:    '#10B981',
      pulse:  '#34D399',
    },
    moderate: {
      bgFrom: '#FFFBEB',
      bgTo:   '#FEF3C7',
      text:   '#92400E',
      border: '#FDE68A',
      dot:    '#F59E0B',
      pulse:  '#FBBF24',
    },
    crowded: {
      bgFrom: '#FEF2F2',
      bgTo:   '#FFF7ED',
      text:   '#991B1B',
      border: '#FECACA',
      dot:    '#EF4444',
      pulse:  '#F87171',
    },
  },
  copy: {
    available: {
      main: 'すぐにご案内できます ☕️',
      sub:  'お待たせせずにご提供中です',
    },
    moderate: {
      main:      '少し賑わってます ☕️',
      subPrefix: 'まもなくご案内（{wait}）',
    },
    crowded: {
      main: '多くのお客様にご利用中 ☕️',
      sub:  '香りを楽しみながらお待ちください',
    },
  },
};
