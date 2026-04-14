import { ShopItem, Achievement } from '../types/game';

export const XP_PER_LEVEL = 1000;

export const calculateLevel = (xp: number): number => Math.floor(xp / XP_PER_LEVEL) + 1;

export const calculateXPProgress = (xp: number): number => (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

export const TOTAL_LEVELS = 50;

export const DEFAULT_TIMER_SECONDS = 15;

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hint', name: 'Hint', description: 'Eliminate 2 wrong answers', cost: 50, icon: 'Zap', color: 'indigo' },
  { id: 'freeze', name: 'Time Freeze', description: 'Stop timer for 15 seconds', cost: 75, icon: 'Snowflake', color: 'cyan' },
  { id: 'skip', name: 'Skip', description: 'Skip current question', cost: 100, icon: 'SkipForward', color: 'purple' },
  { id: 'shield', name: 'Shield', description: 'Protect from 1 wrong answer', cost: 150, icon: 'Shield', color: 'yellow' },
  { id: 'double_points', name: '2x Points', description: '2x XP for 5 questions', cost: 150, icon: 'Sparkles', color: 'orange' },
  { id: 'extra_life', name: 'Extra Life', description: '+1 life (max 5)', cost: 200, icon: 'Heart', color: 'red' },
  { id: 'timer_extend', name: 'Timer +10s', description: 'Increase timer to 25s', cost: 100, icon: 'Clock', color: 'green' },
  { id: 'streak_freeze', name: 'Streak Freeze', description: 'Keep streak on wrong answer', cost: 300, icon: 'Flame', color: 'amber' },
  { id: 'potion', name: 'Health Potion', description: 'Restore 1 life', cost: 100, icon: 'Heart', color: 'pink' },
  { id: 'xp_boost', name: 'XP Boost', description: '1.5x XP for 10 minutes', cost: 200, icon: 'TrendingUp', color: 'emerald' },
  { id: 'hint_pack', name: 'Hint Pack', description: '5 Hints', cost: 200, icon: 'Zap', color: 'indigo' },
  { id: 'shield_pack', name: 'Shield Pack', description: '3 Shields', cost: 350, icon: 'Shield', color: 'yellow' },
  { id: 'streak_charm', name: 'Streak Charm', description: 'Double streak bonus', cost: 500, icon: 'Flame', color: 'orange' },
  { id: 'time_warp', name: 'Time Warp', description: 'Double time bonus', cost: 400, icon: 'Clock', color: 'blue' },
  { id: 'lucky_charm', name: 'Lucky Charm', description: '50% chance to retry wrong', cost: 600, icon: 'Star', color: 'purple' },
  { id: 'perfect_run', name: 'Perfect Run', description: 'No penalty for mistakes', cost: 800, icon: 'Trophy', color: 'gold' },
  { id: 'bundle', name: 'Starter Bundle', description: '10 of each item', cost: 1500, icon: 'Gift', color: 'rainbow' },
  { id: 'premium', name: 'Premium Pass', description: 'Remove ads + bonus XP', cost: 5000, icon: 'Crown', color: 'gold' },
];

export const PLAYER_INVENTORY_KEY = 'polyglot_inventory';

export const getDefaultInventory = () => ({
  hints: 3,
  freezes: 2,
  skips: 2,
  shields: 1,
  streakFreezes: 0,
  potions: 0,
  xpBoosts: 0,
});

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first lesson', xp: 50, icon: 'Star' },
  { id: 'quick_learner', name: 'Quick Learner', description: '10 correct in a row', xp: 100, icon: 'Zap' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', xp: 150, icon: 'Flame' },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', xp: 300, icon: 'Award' },
  { id: 'polyglot', name: 'Polyglot', description: 'Complete in 5 languages', xp: 500, icon: 'Globe' },
  { id: 'perfect_round', name: 'Perfect Round', description: 'Complete all questions correctly', xp: 250, icon: 'Trophy' },
  { id: 'survivor', name: 'Survivor', description: 'Complete with 1 life remaining', xp: 150, icon: 'Heart' },
];

export const getPlayerTitle = (level: number): string => {
  if (level < 10) return 'Novice';
  if (level < 20) return 'Apprentice';
  if (level < 30) return 'Intermediate';
  if (level < 40) return 'Advanced';
  if (level < 50) return 'Expert';
  return 'Master';
};

export const ERROR_HISTORY_KEY = 'polyglot_error_history';

export const getDefaultErrorHistory = () => ({
  errors: [] as { phrase: string; correct: string; selected: string; language: string; timestamp: number }[],
});
