import { motion } from 'framer-motion';
import { Skull, Target, Flame } from 'lucide-react';

interface GameOverScreenProps {
  currentLevel: number;
  score: number;
  maxStreak: number;
  totalQuestions: number;
  onTryAgain: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ currentLevel, score, maxStreak, totalQuestions, onTryAgain }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center"
    >
      <div className="bg-neutral-800 border-2 border-red-600 p-6">
        <Skull className="w-16 h-16 text-red-500 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
        <p className="text-neutral-400 text-sm mb-4">You reached question {currentLevel + 1} of {totalQuestions}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-900 p-3 border border-neutral-600">
            <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-neutral-400">Score</p>
            <p className="text-xl text-blue-400">{score}</p>
          </div>
          <div className="bg-neutral-900 p-3 border border-neutral-600">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xs text-neutral-400">Best Streak</p>
            <p className="text-xl text-orange-400">{maxStreak}</p>
          </div>
        </div>

        <div className="bg-neutral-900 p-3 border border-neutral-600 mb-4">
          <p className="text-xs text-neutral-400">Progress</p>
          <div className="w-full bg-neutral-700 h-2 mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              style={{ width: `${totalQuestions > 0 ? ((currentLevel + 1) / totalQuestions) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 mt-1">{currentLevel + 1}/{totalQuestions} completed</p>
        </div>

        <button 
          onClick={onTryAgain}
          className="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold border-2 border-neutral-500 hover:underline transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
};
