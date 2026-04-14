import { PlayerProgress, PlayerStats, PlayerInventory, ErrorHistory, ErrorEntry } from '../types/game';

const STORAGE_KEY = 'polyglot_progress';
const INVENTORY_KEY = 'polyglot_inventory';
const ERROR_HISTORY_KEY = 'polyglot_error_history';

export const getDefaultProgress = (): PlayerProgress => ({
  xp: 0,
  level: 1,
  totalXp: 0,
  languagesUsed: [],
  achievements: [],
  stats: {
    played: 0,
    correct: 0,
    wrong: 0,
    bestStreak: 0,
    totalQuestions: 0,
    dailyStreak: 0,
    lastPlayedDate: '',
  },
});

export const loadProgress = (): PlayerProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    console.warn('Failed to load progress from localStorage');
  }
  return getDefaultProgress();
};

export const saveProgress = (progress: PlayerProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Failed to save progress to localStorage');
  }
};

export const createInitialStats = (): PlayerStats => ({
  played: 0,
  correct: 0,
  wrong: 0,
  bestStreak: 0,
  totalQuestions: 0,
  dailyStreak: 0,
  lastPlayedDate: '',
});

export const getDefaultInventory = (): PlayerInventory => ({
  hints: 3,
  freezes: 2,
  skips: 2,
  shields: 1,
  streakFreezes: 0,
  potions: 0,
  xpBoosts: 0,
});

export const loadInventory = (): PlayerInventory => {
  try {
    const saved = localStorage.getItem(INVENTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return getDefaultInventory();
};

export const saveInventory = (inventory: PlayerInventory): void => {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch {}
};

export const getDefaultErrorHistory = (): ErrorHistory => ({
  errors: [],
});

export const loadErrorHistory = (): ErrorHistory => {
  try {
    const saved = localStorage.getItem(ERROR_HISTORY_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return getDefaultErrorHistory();
};

export const saveErrorHistory = (history: ErrorHistory): void => {
  try {
    localStorage.setItem(ERROR_HISTORY_KEY, JSON.stringify(history));
  } catch {}
};

export const addError = (entry: ErrorEntry): void => {
  const history = loadErrorHistory();
  history.errors.unshift(entry);
  if (history.errors.length > 50) {
    history.errors = history.errors.slice(0, 50);
  }
  saveErrorHistory(history);
};
