import { motion } from 'framer-motion';
import { Star, BarChart, Flame, Target } from 'lucide-react';
import { languages } from '../phrases';
import { calculateLevel, calculateXPProgress, TOTAL_LEVELS } from '../constants/game';
import { PlayerProgress, Language } from '../types/game';

interface StartScreenProps {
  progress: PlayerProgress;
  language: Language;
  sourceLanguage: Language;
  setSourceLanguage: (lang: Language) => void;
  setLanguage: (lang: Language) => void;
  selectedDifficulty: number;
  setSelectedDifficulty: (diff: number) => void;
  onStart: () => void;
  onVocab: () => void;
  onGrammar: () => void;
  onMode: () => void;
  onShop: () => void;
  onStats: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  progress,
  language,
  sourceLanguage,
  setSourceLanguage,
  setLanguage,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart,
  onVocab,
  onGrammar,
  onMode,
  onShop,
  onStats,
}) => {
  const currentPlayerLevel = calculateLevel(progress.xp);
  const xpProgress = calculateXPProgress(progress.xp);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center"
    >
      <div className="bg-neutral-800 border-2 border-neutral-600 p-6 mb-4">
        <div className="relative mx-auto w-24 h-24 mb-3">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=PolyglotPeril&backgroundColor=22c55e" 
            alt="Owl" 
            className="w-24 h-24"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Translate Mania</h1>
        <p className="text-neutral-400 text-sm">Translate {TOTAL_LEVELS} phrases to survive</p>
      </div>

      <div className="bg-neutral-800 border-2 border-neutral-600 p-3 mb-4">
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-neutral-300">Level {currentPlayerLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-neutral-300">{progress.xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-neutral-300">{progress.stats.bestStreak}</span>
          </div>
        </div>
        <div className="w-full bg-neutral-700 h-1 mt-2">
          <div className="h-1 bg-yellow-400" style={{ width: `${xpProgress}%` }}></div>
        </div>
      </div>

      <div className="bg-neutral-800 border-2 border-neutral-600 p-3 mb-3">
        <label className="block text-xs font-bold text-neutral-400 mb-2">FROM (Your Language)</label>
        <div className="grid grid-cols-5 gap-1 mb-3">
          {languages.map((lang) => {
            const isTarget = lang.code === language.code;
            return (
            <button
              key={lang.code}
              onClick={() => !isTarget && setSourceLanguage(lang)}
              disabled={isTarget}
              className="py-1 px-0.5 text-xs font-semibold transition-all relative disabled:opacity-30"
              style={{ 
                color: sourceLanguage.code === lang.code ? lang.color : '#525252',
                backgroundColor: sourceLanguage.code === lang.code ? `${lang.color}20` : 'transparent',
              }}
            >
              <span className="relative inline-block pb-1">
                {lang.name.slice(0,3)}
                {sourceLanguage.code === lang.code && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: lang.color }}></span>
                )}
              </span>
            </button>
          )})}
        </div>
        <label className="block text-xs font-bold text-neutral-400 mb-2">TO (Translate to)</label>
        <div className="grid grid-cols-5 gap-1">
          {languages.map((lang) => {
            const isSource = lang.code === sourceLanguage.code;
            return (
            <button
              key={lang.code}
              onClick={() => !isSource && setLanguage(lang)}
              disabled={isSource}
              className="py-1 px-0.5 text-xs font-semibold transition-all relative disabled:opacity-30"
              style={{ 
                color: language.code === lang.code ? lang.color : '#525252',
                backgroundColor: language.code === lang.code ? `${lang.color}20` : 'transparent',
              }}
            >
              <span className="relative inline-block pb-1">
                {lang.name.slice(0,3)}
                {language.code === lang.code && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: lang.color }}></span>
                )}
              </span>
            </button>
          )})}
        </div>
      </div>

      <div className="bg-neutral-800 border-2 border-neutral-600 p-2 mb-3">
        <label className="block text-xs font-bold text-neutral-400 mb-2">Difficulty</label>
        <div className="flex gap-1">
          {['Easy', 'Medium', 'Hard', 'Expert'].map((diff, i) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(i + 1)}
              className="flex-1 py-1 text-xs font-semibold border transition-all relative"
              style={{ 
                borderColor: selectedDifficulty === i + 1 
                  ? (i === 0 ? '#22C55E' : i === 1 ? '#EAB308' : i === 2 ? '#EF4444' : '#A855F7')
                  : 'transparent',
                color: selectedDifficulty === i + 1 
                  ? (i === 0 ? '#22C55E' : i === 1 ? '#EAB308' : i === 2 ? '#EF4444' : '#A855F7')
                  : '#525252',
              }}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-800 border-2 border-neutral-600 p-2 mb-3">
        <button 
          onClick={onStart}
          className="w-full py-2 text-white font-bold border border-neutral-400 hover:border-white hover:underline transition-all flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4" /> Start
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={onVocab}
          className="py-2 px-2 bg-neutral-800 border-2 border-neutral-600 text-neutral-300 text-sm font-semibold hover:border-green-400 transition-all relative"
        >
          <span className="relative">Vocabulary</span>
        </button>
        <button 
          onClick={onGrammar}
          className="py-2 px-2 bg-neutral-800 border-2 border-neutral-600 text-neutral-300 text-sm font-semibold hover:border-blue-400 transition-all relative"
        >
          <span className="relative">Grammar</span>
        </button>
        <button 
          onClick={onMode}
          className="py-2 px-2 bg-neutral-800 border-2 border-neutral-600 text-neutral-300 text-sm font-semibold hover:border-orange-400 transition-all relative"
        >
          <span className="relative">Modes</span>
        </button>
        <button 
          onClick={onShop}
          className="py-2 px-2 bg-neutral-800 border-2 border-neutral-600 text-neutral-300 text-sm font-semibold hover:bg-neutral-700 hover:underline decoration-1 underline-offset-2 transition-all"
        >
          Shop
        </button>
        <button 
          onClick={onStats}
          className="py-2 px-2 bg-neutral-800 border-2 border-neutral-600 text-neutral-300 text-sm font-semibold hover:bg-neutral-700 hover:underline decoration-1 underline-offset-2 transition-all col-span-2"
        >
          Stats
        </button>
      </div>
    </motion.div>
  );
};
