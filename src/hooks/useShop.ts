import { useState, useCallback } from 'react';
import { ShopItem } from '../types/game';
import { playSound } from '../utils/sounds';
import { saveProgress, loadInventory, saveInventory } from '../utils/progress';

interface UseShopResult {
  inventory: ReturnType<typeof loadInventory>;
  purchaseItem: (item: ShopItem, progress: any, setProgress: React.Dispatch<React.SetStateAction<any>>) => void;
}

export const useShop = (): UseShopResult => {
  const [inventory, setInventory] = useState(loadInventory());

  const purchaseItem = useCallback((item: ShopItem, progress: any, setProgress: React.Dispatch<React.SetStateAction<any>>) => {
    if (progress.xp >= item.cost) {
      const newXp = progress.xp - item.cost;
      setProgress((prev: any) => {
        const updated = { ...prev, xp: newXp };
        saveProgress(updated);
        return updated;
      });
      playSound('coin');

      const newInventory = { ...inventory };
      switch (item.id) {
        case 'hint': newInventory.hints += 3; break;
        case 'freeze': newInventory.freezes += 3; break;
        case 'skip': newInventory.skips += 3; break;
        case 'shield': newInventory.shields += 3; break;
        case 'streak_freeze': newInventory.streakFreezes += 2; break;
        case 'potion': newInventory.potions += 3; break;
        case 'xp_boost': newInventory.xpBoosts += 1; break;
      }
      setInventory(newInventory);
      saveInventory(newInventory);
    }
  }, [inventory]);

  return { inventory, purchaseItem };
};
