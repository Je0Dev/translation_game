import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, BarChart, Clock, Zap, Snowflake, SkipForward, Shield, Volume2, VolumeX, Ear } from 'lucide-react';
import { Question, Language } from '../types/game';
import { useState } from 'react';

interface GameScreenProps {
  questions: Question[];
  currentLevel: number;
  currentOptions: string[];
  lives: number;
  score: number;
  streak: number;
  timeLeft: number;
  timerFrozen: boolean;
  hints: number;
  freezes: number;
  skips: number;
  shields: number;
  eliminatedOptions: string[];
  lastAnswerCorrect: boolean | null;
  selectedOption: string | null;
  snarkyMessage: string;
  shake: boolean;
  language: Language;
  sourceLanguage: Language;
  onAnswer: (option: string) => void;
  onQuit: () => void;
  onHint: () => void;
  onFreeze: () => void;
  onSkip: () => void;
  onShield: () => void;
  onSpeak: (text: string, lang: string) => void;
  pointsEarned?: number;
  pinyins?: string[];
}

const shakeVariants = {
  shake: { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } },
  still: { x: 0 }
};

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  currentLevel,
  currentOptions,
  lives,
  score,
  streak,
  timeLeft,
  timerFrozen,
  hints,
  freezes,
  skips,
  shields,
  eliminatedOptions,
  lastAnswerCorrect,
  selectedOption,
  snarkyMessage,
  shake,
  language,
  sourceLanguage,
  onAnswer,
  onQuit,
  onHint,
  onFreeze,
  onSkip,
  onShield,
  onSpeak,
  pointsEarned = 0,
  pinyins = [],
}) => {
  const currentQuestion = questions[currentLevel];
  const [speakingOption, setSpeakingOption] = useState<string | null>(null);
  const [speakingSource, setSpeakingSource] = useState(false);

  if (!currentQuestion) return null;

  const handleSpeakOption = (opt: string, lang: string) => {
    setSpeakingOption(opt);
    onSpeak(opt, lang);
    setTimeout(() => setSpeakingOption(null), 1500);
  };

  const handleSpeakSource = () => {
    setSpeakingSource(true);
    onSpeak(currentQuestion.english, sourceLanguage.code);
    setTimeout(() => setSpeakingSource(false), 1500);
  };

  const showStreakFire = streak > 0 && streak % 10 === 0;

  const difficultyColor = currentQuestion.difficulty <= 2 ? '#22C55E' : currentQuestion.difficulty <= 3 ? '#EAB308' : '#EF4444';
  const difficultyLabel = currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : currentQuestion.difficulty === 3 ? 'Hard' : currentQuestion.difficulty === 4 ? 'Expert' : 'Master';

  const sourcePinyin = currentQuestion.pinyin || (pinyins && pinyins[0]) || '';

  return (
    <motion.div 
      variants={shakeVariants}
      animate={shake ? "shake" : "still"}
      className="max-w-3xl w-full"
    >
      <AnimatePresence>
        {showStreakFire && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1.2, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <Flame className="w-32 h-32 text-orange-500 animate-pulse drop-shadow-lg" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-yellow-400"
            >
              🔥{streak}🔥
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastAnswerCorrect && pointsEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 right-8 z-50 pointer-events-none"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl font-bold text-green-400 drop-shadow-lg"
            >
              +{pointsEarned} XP
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 mb-4 w-full">
        <div className="flex justify-between items-center w-full bg-neutral-800 border-2 border-neutral-600 p-2">
          <div className="flex items-center gap-2">
            <button onClick={onQuit} className="text-neutral-400 hover:text-white hover:underline text-sm">Exit</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${lives >= 1 ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
              <Heart className={`w-4 h-4 ${lives >= 2 ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
              <Heart className={`w-4 h-4 ${lives >= 3 ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-neutral-500'}`} />
              <span className="text-neutral-300">{streak}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <BarChart className="w-4 h-4 text-blue-400" />
              <span className="text-neutral-300">{score}</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between text-xs text-neutral-400 mb-1">
            <span>{currentLevel + 1}/{questions.length}</span>
            <span className="text-xs">{difficultyLabel}</span>
          </div>
          <div className="w-full bg-neutral-700 h-1">
            <div className="h-1" style={{ width: `${((currentLevel + 1) / questions.length) * 100}%`, backgroundColor: language.color }}></div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-neutral-800 border-2 border-neutral-600 p-2">
          <div className="flex items-center gap-2 px-3 py-1 border border-neutral-500">
            <Clock className={`w-4 h-4 ${timerFrozen ? 'text-cyan-400' : timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-neutral-300'}`} />
            <span className={`font-mono font-bold text-lg ${timerFrozen ? 'text-cyan-400' : timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-end">
            <button 
              onClick={onHint}
              disabled={hints === 0 || eliminatedOptions.length > 0 || lastAnswerCorrect !== null}
              className="flex items-center gap-1 px-2 py-1 border border-neutral-500 hover:border-indigo-400 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="50/50 Hint"
            >
              <Zap className="w-3 h-3 text-indigo-400" />
              <span className="font-bold text-xs text-neutral-300">{hints}</span>
            </button>
            <button 
              onClick={onFreeze}
              disabled={freezes === 0 || timerFrozen || lastAnswerCorrect !== null}
              className="flex items-center gap-1 px-2 py-1 border border-neutral-500 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Time Freeze"
            >
              <Snowflake className="w-3 h-3 text-cyan-400" />
              <span className="font-bold text-xs text-neutral-300">{freezes}</span>
            </button>
            <button 
              onClick={onSkip}
              disabled={skips === 0 || lastAnswerCorrect !== null}
              className="flex items-center gap-1 px-2 py-1 border border-neutral-500 hover:border-purple-400 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Skip"
            >
              <SkipForward className="w-3 h-3 text-purple-400" />
              <span className="font-bold text-xs text-neutral-300">{skips}</span>
            </button>
            <button 
              onClick={onShield}
              disabled={shields === 0 || lastAnswerCorrect !== null}
              className="flex items-center gap-1 px-2 py-1 border border-neutral-500 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Shield"
            >
              <Shield className="w-3 h-3 text-yellow-400" />
              <span className="font-bold text-xs text-neutral-300">{shields}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-neutral-800 border-2 border-neutral-600 h-2">
            <div 
              className="h-full"
              style={{ width: `${((currentLevel + 1) / questions.length) * 100}%`, backgroundColor: difficultyColor }}
            ></div>
          </div>
          <div className={`text-xs font-bold px-2 py-1 border shrink-0 ${
            currentQuestion.difficulty <= 2 ? 'border-green-500 text-green-400' :
            currentQuestion.difficulty === 3 ? 'border-yellow-500 text-yellow-400' :
            'border-red-500 text-red-400'
          }`}>
            {difficultyLabel}
          </div>
          <div className="text-neutral-300 text-xs font-bold px-2 py-1 border border-neutral-500 shrink-0">
            {currentLevel + 1}/{questions.length}
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border-2 border-neutral-600 p-4 sm:p-6 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs sm:text-sm font-bold" style={{ color: language.color }}>
            {sourceLanguage.name} → {language.name}
          </h2>
          <button 
            onClick={handleSpeakSource}
            className={`flex items-center gap-1 px-2 py-1 border border-neutral-500 hover:border-white transition-colors ${speakingSource ? 'animate-pulse' : ''}`}
          >
            {speakingSource ? <Ear className="w-3 h-3 text-green-400" /> : <Volume2 className="w-3 h-3" />} <span className="text-xs">Listen</span>
          </button>
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 pb-2 relative inline-block">
          "{currentQuestion.english}"
          <span className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: language.color }}></span>
        </p>

        {sourceLanguage.code === 'zh-CN' && sourcePinyin && (
          <p className="text-sm text-neutral-400 mb-4 italic">
            Pinyin: {sourcePinyin}
          </p>
        )}

        <div className="min-h-[3rem] mb-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {snarkyMessage && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className={`text-center font-bold px-6 py-3 rounded-xl shadow-lg w-full max-w-lg ${
                  lastAnswerCorrect 
                  ? 'text-green-300 bg-green-900/60 border border-green-500/30' 
                  : 'text-red-300 bg-red-900/60 border border-red-500/30'
                }`}
              >
                {snarkyMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {currentOptions.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isEliminated = eliminatedOptions.includes(opt);
            const isSpeaking = speakingOption === opt;
            
            return (
              <div
                key={i}
                className="relative p-3 border-2 transition-all duration-200 group cursor-pointer"
                onClick={() => lastAnswerCorrect === null && !isEliminated && onAnswer(opt)}
                style={{ 
                  borderColor: isSelected 
                    ? (lastAnswerCorrect ? '#4ADE80' : '#F87171')
                    : isEliminated ? '#404040' : '#525252',
                  backgroundColor: isSelected ? (lastAnswerCorrect ? '#22C55E20' : '#EF444420') : 'transparent',
                  opacity: isEliminated ? 0.4 : 1,
                }}
              >
                <span className="text-sm sm:text-base font-medium block relative pr-10">
                  {language.code === 'zh-CN' && pinyins[i] && (
                    <span className="block text-xs text-neutral-400 italic mb-1">{pinyins[i]}</span>
                  )}
                  {opt}
                  {lastAnswerCorrect === null && !isEliminated && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" 
                      style={{ backgroundColor: language.color }}></span>
                  )}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleSpeakOption(opt, language.code); }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-700 transition-colors ${isSpeaking ? 'animate-pulse' : ''}`}
                  title="Listen to pronunciation"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-green-400" /> : <Volume2 className="w-4 h-4 text-neutral-400" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  );
};
