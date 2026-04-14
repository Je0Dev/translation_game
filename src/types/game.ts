export type GameState = 'start' | 'mode' | 'shop' | 'loading' | 'playing' | 'gameover' | 'victory' | 'stats' | 'vocab' | 'grammar';
export type GameMode = 'classic' | 'daily' | 'speedrun' | 'practice' | 'maniac';

export interface Question {
  english: string;
  translation: string;
  options: string[];
  snarkyRemark: string;
  difficulty: number;
  fromLang?: string;
  toLang?: string;
  pinyin?: string;
}

export interface PlayerProgress {
  xp: number;
  level: number;
  totalXp: number;
  languagesUsed: string[];
  achievements: string[];
  stats: PlayerStats;
}

export interface PlayerStats {
  played: number;
  correct: number;
  wrong: number;
  bestStreak: number;
  totalQuestions: number;
  dailyStreak: number;
  lastPlayedDate: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: string;
}

export interface Language {
  name: string;
  code: string;
  color: string;
  hover?: string;
}

export interface PlayerInventory {
  hints: number;
  freezes: number;
  skips: number;
  shields: number;
  streakFreezes: number;
  potions: number;
  xpBoosts: number;
}

export interface ErrorEntry {
  phrase: string;
  correct: string;
  selected: string;
  fromLang: string;
  toLang: string;
  timestamp: number;
}

export interface ErrorHistory {
  errors: ErrorEntry[];
}
