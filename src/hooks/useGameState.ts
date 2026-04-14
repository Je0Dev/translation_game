import { useState } from 'react';
import { Language } from '../types/game';
import { languages } from '../phrases';

interface UseGameStateResult {
  gameState: string;
  gameMode: string;
  toLanguage: Language;
  fromLanguage: Language;
  selectedDifficulty: number;
  setGameState: React.Dispatch<React.SetStateAction<string>>;
  setGameMode: React.Dispatch<React.SetStateAction<string>>;
  setToLanguage: React.Dispatch<React.SetStateAction<Language>>;
  setFromLanguage: React.Dispatch<React.SetStateAction<Language>>;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<number>>;
}

export const useGameState = (): UseGameStateResult => {
  const [gameState, setGameState] = useState<string>('start');
  const [gameMode, setGameMode] = useState<string>('classic');
  const [toLanguage, setToLanguage] = useState<Language>(languages[0]);
  const [fromLanguage, setFromLanguage] = useState<Language>(languages[2]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);

  return {
    gameState,
    gameMode,
    toLanguage,
    fromLanguage,
    selectedDifficulty,
    setGameState,
    setGameMode,
    setToLanguage,
    setFromLanguage,
    setSelectedDifficulty,
  };
};
