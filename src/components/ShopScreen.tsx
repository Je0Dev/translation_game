import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { SHOP_ITEMS } from '../constants/game';
import { PlayerProgress, ShopItem } from '../types/game';

interface ShopScreenProps {
  progress: PlayerProgress;
  onPurchase: (item: ShopItem) => void;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ progress, onPurchase, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full text-center space-y-6 p-8 bg-neutral-800/80 backdrop-blur-md rounded-3xl border border-neutral-700/50 shadow-2xl"
    >
      <div className="flex items-center justify-center gap-3">
        <ShoppingCart className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Item Shop</h2>
      </div>
      <div className="flex items-center justify-center gap-2 py-2 bg-neutral-900/50 rounded-lg">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="text-2xl font-bold text-white">{progress.xp.toLocaleString()} XP</span>
      </div>
      <div className="space-y-3">
        {SHOP_ITEMS.map(item => (
          <button 
            key={item.id}
            onClick={() => onPurchase(item)}
            disabled={progress.xp < item.cost}
            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-colors ${
              progress.xp >= item.cost 
              ? `bg-${item.color}-900/40 border-${item.color}-500/30 hover:bg-${item.color}-800/40` 
              : 'bg-neutral-900/30 border-neutral-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-${item.color}-400 font-bold text-xl`}>{item.name}</span>
              <span className="text-sm text-neutral-400">{item.description}</span>
            </div>
            <span className="text-yellow-400 font-bold">{item.cost} XP</span>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="text-neutral-400 hover:text-white">Back</button>
    </motion.div>
  );
};
