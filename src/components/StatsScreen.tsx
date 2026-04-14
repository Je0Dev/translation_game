import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, Globe, BookOpen, FileText } from 'lucide-react';
import { calculateLevel } from '../constants/game';
import { PlayerProgress } from '../types/game';
import { loadErrorHistory } from '../utils/progress';

interface StatsScreenProps {
  progress: PlayerProgress;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ progress, onBack }) => {
  const currentPlayerLevel = calculateLevel(progress.xp);
  const errorHistory = loadErrorHistory();
  const recentErrors = errorHistory.errors.slice(0, 10);

  const vocabTopics = [
    { title: 'Daily Life', color: '#22C55E', url: 'https://www.easy-languages.org/vocabulary/daily-routines' },
    { title: 'Food & Drink', color: '#F97316', url: 'https://www.memrise.com/courses/food-drink/' },
    { title: 'Family & People', color: '#3B82F6', url: 'https://www.transparent.com/learn-languages/online-vocabulary-lists/family-and-relationships.html' },
    { title: 'Travel & Places', color: '#A855F7', url: 'https://www.therabbit.org/travel-vocabulary' },
    { title: 'Shopping & Money', color: '#EAB308', url: 'https://ielc.edu.vn/shopping-vocabulary/' },
    { title: 'Health & Body', color: '#EF4444', url: 'https://www.medspanish.com/vocabulary/' },
    { title: 'Work & Career', color: '#06B6D4', url: 'https://www.fluentu.com/blog/english/vocabulary-by-topic/jobs-and-careers/' },
    { title: 'Nature & Weather', color: '#EC4899', url: 'https://www.englishclub.com/vocabulary/nature.php' },
  ];

  const grammarTopics = [
    { title: 'Beginner (A1-A2)', color: '#22C55E', links: [
      { name: 'Spanish', url: 'https://www.efe.cc/spanish-grammar/' },
      { name: 'French', url: 'https://www.lawlessfrench.com/grammar/' },
    ]},
    { title: 'Intermediate (B1-B2)', color: '#EAB308', links: [
      { name: 'Spanish', url: 'https://www.spanishdict.com/grammar' },
      { name: 'French', url: 'https://www.innerfrench.com/' },
    ]},
    { title: 'Advanced (C1-C2)', color: '#EF4444', links: [
      { name: 'Spanish', url: 'https://www.medium.com/@edlitara/spanish-grammar-explained' },
      { name: 'French', url: 'https://www.thoughtco.com/french-subjunctive-1013720428' },
    ]},
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center space-y-6 p-4 bg-neutral-800/80 backdrop-blur-md rounded-3xl border border-neutral-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Your Stats</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <p className="text-xs text-neutral-400 uppercase">Total XP</p>
          <p className="text-xl font-bold text-white">{progress.totalXp.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <p className="text-xs text-neutral-400 uppercase">Level</p>
          <p className="text-xl font-bold text-white">{currentPlayerLevel}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <p className="text-xs text-neutral-400 uppercase">Games Played</p>
          <p className="text-xl font-bold text-white">{progress.stats.played}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <p className="text-xs text-neutral-400 uppercase">Best Streak</p>
          <p className="text-xl font-bold text-orange-400">{progress.stats.bestStreak}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-xs text-neutral-400 uppercase">Correct</p>
          <p className="text-xl font-bold text-green-400">{progress.stats.correct}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl">
          <XCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xs text-neutral-400 uppercase">Wrong</p>
          <p className="text-xl font-bold text-red-400">{progress.stats.wrong}</p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl col-span-2">
          <p className="text-xs text-neutral-400 uppercase">Accuracy</p>
          <p className="text-2xl font-bold text-blue-400">
            {progress.stats.totalQuestions > 0 
              ? Math.round(progress.stats.correct / progress.stats.totalQuestions * 100) 
              : 0}%
          </p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-xl col-span-2">
          <Globe className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-neutral-400 uppercase">Languages Learned</p>
          <p className="text-lg font-bold text-white">{progress.languagesUsed.length}</p>
          <p className="text-xs text-neutral-500">{progress.languagesUsed.join(', ')}</p>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Vocabulary Topics</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-left">
          {vocabTopics.map((topic) => (
            <a 
              key={topic.title}
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border transition-colors hover:border-white"
              style={{ borderColor: `${topic.color}50`, backgroundColor: `${topic.color}10` }}
            >
              <span className="text-xs font-medium" style={{ color: topic.color }}>{topic.title}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Grammar Resources</h3>
        </div>
        <div className="space-y-2 text-left">
          {grammarTopics.map((topic) => (
            <div key={topic.title}>
              <p className="text-xs font-bold mb-1" style={{ color: topic.color }}>{topic.title}</p>
              <div className="grid grid-cols-2 gap-1">
                {topic.links.map((link) => (
                  <a 
                    key={link.name}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded border text-xs text-neutral-300 hover:bg-neutral-700"
                    style={{ borderColor: `${topic.color}30` }}
                  >
                    {link.name} →
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {recentErrors.length > 0 && (
        <div className="border-t border-neutral-700 pt-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-white">Recent Errors</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentErrors.map((err, i) => (
              <div key={i} className="p-2 bg-neutral-900/50 rounded-lg text-left text-xs">
                <p className="text-neutral-300 font-medium">{err.phrase}</p>
                <p className="text-green-400">✓ {err.correct}</p>
                <p className="text-red-400">✗ {err.selected}</p>
                <p className="text-neutral-500 text-[10px]">{err.fromLang.toUpperCase()} → {err.toLang.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={onBack} className="text-neutral-400 hover:text-white underline">Back</button>
    </motion.div>
  );
};
