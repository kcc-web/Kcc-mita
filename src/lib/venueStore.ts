// src/lib/venueStore.ts
import { DEFAULT_CONFIG, DEFAULT_VENUE_DATA, VenueConfig, VenueData } from './venueTheme';

const DATA_KEY = 'kcc-venue-data';
const CFG_KEY  = 'kcc-venue-config';

export const venueStore = {
  loadData(): VenueData {
    if (typeof window === 'undefined') return DEFAULT_VENUE_DATA;
    try {
      const raw = localStorage.getItem(DATA_KEY);
      return raw ? JSON.parse(raw) as VenueData : DEFAULT_VENUE_DATA;
    } catch {
      return DEFAULT_VENUE_DATA;
    }
  },
  saveData(data: VenueData) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  },
  loadConfig(): VenueConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const raw = localStorage.getItem(CFG_KEY);
      return raw ? JSON.parse(raw) as VenueConfig : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  },
  saveConfig(cfg: VenueConfig) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  },
  resetAll() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(CFG_KEY);
  }
};
