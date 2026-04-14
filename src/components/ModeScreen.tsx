import { motion } from 'framer-motion';
import { Calendar, Target, Skull } from 'lucide-react';

interface ModeScreenProps {
  onSelectMode: (mode: string) => void;
  onBack: () => void;
}

export const ModeScreen: React.FC<ModeScreenProps> = ({ onSelectMode, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center"
    >
      <div className="bg-neutral-800 border-2 border-neutral-600 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Choose Mode</h2>
        <div className="space-y-2">
          <button onClick={() => onSelectMode('daily')} className="w-full p-3 border-2 border-neutral-500 hover:border-orange-400 hover:underline text-left transition-colors flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="font-bold text-white">Daily Challenge</h3>
              <p className="text-xs text-neutral-400">15 phrases - New challenge every day</p>
            </div>
          </button>
          <button onClick={() => onSelectMode('practice')} className="w-full p-3 border-2 border-neutral-500 hover:border-blue-400 hover:underline text-left transition-colors flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="font-bold text-white">Practice Mode</h3>
              <p className="text-xs text-neutral-400">40 phrases - No timer, learn at your pace</p>
            </div>
          </button>
          <button onClick={() => onSelectMode('maniac')} className="w-full p-3 border-2 border-neutral-500 hover:border-purple-400 hover:underline text-left transition-colors flex items-center gap-3">
            <Skull className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-bold text-white">Maniac Mode</h3>
              <p className="text-xs text-neutral-400">25 phrases - Random FROM/TO languages!</p>
            </div>
          </button>
        </div>
      </div>
      <button onClick={onBack} className="text-neutral-400 hover:text-white underline mt-3">Back</button>
    </motion.div>
  );
};
