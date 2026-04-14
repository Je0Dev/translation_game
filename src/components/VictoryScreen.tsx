import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface VictoryScreenProps {
  questionsLength: number;
  score: number;
  maxStreak: number;
  onContinue: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ questionsLength, score, maxStreak, onContinue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg w-full text-center"
    >
      <div className="bg-neutral-800 border-2 border-green-600 p-6">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-white mb-2">You Survived!</h2>
        <p className="text-neutral-400 text-sm mb-4">You translated all {questionsLength} phrases</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-900 p-3 border border-neutral-600">
            <p className="text-xs text-neutral-400">Score</p>
            <p className="text-xl text-blue-400">{score}</p>
          </div>
          <div className="bg-neutral-900 p-3 border border-neutral-600">
            <p className="text-xs text-neutral-400">Streak</p>
            <p className="text-xl text-orange-400">{maxStreak}</p>
          </div>
        </div>

        <button 
          onClick={onContinue}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold border-2 border-green-500 hover:underline transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};
