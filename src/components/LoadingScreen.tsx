import { motion } from 'framer-motion';
import { Loader2, LogOut, ArrowRight } from 'lucide-react';
import { Language } from '../types/game';

interface LoadingScreenProps {
  message: string;
  onCancel: () => void;
  fromLanguage?: Language;
  toLanguage?: Language;
  samplePhrase?: string;
  sampleTranslation?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message, 
  onCancel,
  fromLanguage,
  toLanguage,
  samplePhrase,
  sampleTranslation 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="max-w-md w-full text-center space-y-8 p-10 bg-neutral-800/80 backdrop-blur-md rounded-3xl border border-neutral-700/50 shadow-2xl"
    >
      <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto" />
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Generating Levels</h2>
        <p className="text-green-400 font-medium animate-pulse">{message}</p>
      </div>
      
      {fromLanguage && toLanguage && samplePhrase && (
        <div className="bg-neutral-900/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span 
              className="text-sm font-semibold px-2 py-1 rounded"
              style={{ color: fromLanguage.color, backgroundColor: `${fromLanguage.color}20` }}
            >
              {fromLanguage.name}
            </span>
            <ArrowRight className="w-4 h-4 text-neutral-500" />
            <span 
              className="text-sm font-semibold px-2 py-1 rounded"
              style={{ color: toLanguage.color, backgroundColor: `${toLanguage.color}20` }}
            >
              {toLanguage.name}
            </span>
          </div>
          <p className="text-neutral-300 text-lg font-medium">{samplePhrase}</p>
          {sampleTranslation && (
            <p className="text-neutral-500 text-sm italic">{sampleTranslation}</p>
          )}
        </div>
      )}
      
      <button 
        onClick={onCancel}
        className="text-neutral-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 mx-auto pt-4 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Cancel
      </button>
    </motion.div>
  );
};
