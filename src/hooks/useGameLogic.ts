import { useState, useEffect, useCallback } from 'react';
import { Question, Language, PlayerInventory } from '../types/game';
import { basePhrases, languages, shuffleArray } from '../phrases';
import { translateGamePhrases } from '../translation';
import { playSound } from '../utils/sounds';
import { saveProgress, loadInventory, saveInventory, addError } from '../utils/progress';

interface GameStateConfig {
  gameState: string;
  gameMode: string;
  setProgress: React.Dispatch<React.SetStateAction<any>>;
  setGameState: React.Dispatch<React.SetStateAction<string>>;
}

interface UseInventoryReturn {
  inventory: PlayerInventory;
  deductItem: (itemId: keyof PlayerInventory) => void;
  hints: number;
  freezes: number;
  skips: number;
  shields: number;
}

const useInventory = (gameState: string): UseInventoryReturn => {
  const [inventory, setInventory] = useState<PlayerInventory>(loadInventory());

  useEffect(() => {
    if (gameState === 'start' || gameState === 'shop') {
      setInventory(loadInventory());
    }
  }, [gameState]);

  const deductItem = useCallback((itemId: keyof PlayerInventory) => {
    setInventory(prev => {
      const updated = { ...prev, [itemId]: Math.max(0, (prev[itemId] as number) - 1) };
      saveInventory(updated);
      return updated;
    });
  }, []);

  return {
    inventory,
    deductItem,
    hints: inventory.hints,
    freezes: inventory.freezes,
    skips: inventory.skips,
    shields: inventory.shields,
  };
};

interface UseGameTimerReturn {
  timeLeft: number;
  timerFrozen: boolean;
  setTimerFrozen: React.Dispatch<React.SetStateAction<boolean>>;
  startTimer: () => void;
  stopTimer: () => void;
  freezeTimer: () => void;
}

const useGameTimer = (gameState: string, onTimeout: () => void): UseGameTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerFrozen, setTimerFrozen] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && !timerFrozen) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            onTimeout();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timerFrozen, onTimeout]);

  const startTimer = useCallback(() => {
    setTimeLeft(15);
    setTimerFrozen(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTimeLeft(0);
  }, []);

  const freezeTimer = useCallback(() => {
    setTimerFrozen(true);
  }, []);

  return { timeLeft, timerFrozen, setTimerFrozen, startTimer, stopTimer, freezeTimer };
};

export const useGameLogic = ({ 
  gameState, 
  gameMode, 
  setProgress, 
  setGameState 
}: GameStateConfig) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [snarkyMessage, setSnarkyMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [samplePhrase, setSamplePhrase] = useState("");
  const [sampleTranslation, setSampleTranslation] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);

  const { hints, freezes, skips, shields, deductItem } = useInventory(gameState);
  const { timeLeft, timerFrozen, setTimerFrozen, startTimer: resetTimer } = useGameTimer(gameState, () => handleAnswer(null, true));

  const currentQuestion = questions[currentLevel];

  const calculatePoints = useCallback((difficulty: number, currentStreak: number, time: number) => {
    return 10 * difficulty + Math.floor(currentStreak / 5) * 5 + time;
  }, []);

  const updateProgress = useCallback((points: number, correct: boolean, currentStreak: number) => {
    if (gameMode !== 'practice') {
      setProgress((prev: any) => {
        const newXp = prev.xp + points;
        const updated = {
          ...prev,
          xp: newXp,
          totalXp: prev.totalXp + points,
          stats: {
            ...prev.stats,
            correct: prev.stats.correct + (correct ? 1 : 0),
            wrong: prev.stats.wrong + (correct ? 0 : 1),
            totalQuestions: prev.stats.totalQuestions + 1,
            bestStreak: Math.max(prev.stats.bestStreak, currentStreak)
          }
        };
        saveProgress(updated);
        return updated;
      });
    }
  }, [gameMode, setProgress]);

  const handleCorrectAnswer = useCallback((points: number, currentStreak: number) => {
    playSound('correct');
    setLastAnswerCorrect(true);
    setScore(s => s + points);
    setPointsEarned(points);
    setStreak(s => s + 1);
    setMaxStreak(m => Math.max(m, currentStreak));
    updateProgress(points, true, currentStreak);

    setTimeout(() => {
      if (currentLevel + 1 < questions.length) {
        setCurrentLevel(l => l + 1);
        setLastAnswerCorrect(null);
        setSelectedOption(null);
      } else {
        setGameState('victory');
      }
    }, 1000);
  }, [currentLevel, questions.length, setGameState, updateProgress]);

  const handleWrongAnswer = useCallback((isTimeout: boolean, currentStreak: number) => {
    if (currentQuestion) {
      addError({
        phrase: currentQuestion.english,
        correct: currentQuestion.translation,
        selected: selectedOption || 'TIMEOUT',
        fromLang: currentQuestion.fromLang || 'en',
        toLang: currentQuestion.toLang || 'en',
        timestamp: Date.now()
      });
    }

    if (shields > 0 && gameMode !== 'practice') {
      deductItem('shields');
      playSound('powerup');
      setSnarkyMessage("Shield active! You survived... this time.");
      setLastAnswerCorrect(false);
      setTimeout(() => {
        if (currentLevel + 1 < questions.length) {
          setCurrentLevel(l => l + 1);
          setLastAnswerCorrect(null);
          setSelectedOption(null);
          setSnarkyMessage("");
        } else {
          setGameState('victory');
        }
      }, 1500);
    } else {
      playSound('wrong');
      setLastAnswerCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setStreak(0);
      setLives(l => l - 1);
      setSnarkyMessage(isTimeout ? "Too slow. The Owl is disappointed." : currentQuestion?.snarkyRemark || "");
      updateProgress(0, false, currentStreak);

      if (lives <= 1 && gameMode !== 'practice') {
        setTimeout(() => setGameState('gameover'), 1500);
      } else {
        setTimeout(() => {
          if (currentLevel + 1 < questions.length) {
            setCurrentLevel(l => l + 1);
            setLastAnswerCorrect(null);
            setSelectedOption(null);
            setSnarkyMessage("");
          } else {
            setGameState('victory');
          }
        }, 2000);
      }
    }
  }, [currentQuestion, selectedOption, shields, gameMode, deductItem, currentLevel, questions.length, lives, setGameState, updateProgress]);

  const handleAnswer = useCallback((option: string | null, isTimeout = false) => {
    if (lastAnswerCorrect !== null || !currentQuestion) return;
    
    setSelectedOption(option);
    const isCorrect = !isTimeout && option === currentQuestion.translation;
    const currentStreak = streak + 1;
    const points = calculatePoints(currentQuestion.difficulty, streak, timeLeft);
    
    if (isCorrect) {
      handleCorrectAnswer(points, currentStreak);
    } else {
      handleWrongAnswer(isTimeout, currentStreak);
    }
  }, [lastAnswerCorrect, currentQuestion, streak, timeLeft, calculatePoints, handleCorrectAnswer, handleWrongAnswer]);

  useEffect(() => {
    if (gameState === 'playing') {
      resetTimer();
      setEliminatedOptions([]);
      if (questions[currentLevel]) {
        setCurrentOptions(shuffleArray([...questions[currentLevel].options]));
      }
    }
  }, [currentLevel, gameState, questions, resetTimer]);

  const useHint = useCallback(() => {
    if (hints > 0 && !lastAnswerCorrect && currentQuestion) {
      deductItem('hints');
      playSound('powerup');
      const wrong = currentOptions.filter(o => o !== currentQuestion.translation);
      setEliminatedOptions(shuffleArray(wrong).slice(0, 2));
    }
  }, [hints, lastAnswerCorrect, currentQuestion, currentOptions, deductItem]);

  const useFreeze = useCallback(() => {
    if (freezes > 0 && !lastAnswerCorrect && !timerFrozen) {
      deductItem('freezes');
      playSound('powerup');
      setTimerFrozen(true);
    }
  }, [freezes, lastAnswerCorrect, timerFrozen, deductItem]);

  const useSkip = useCallback(() => {
    if (skips > 0 && !lastAnswerCorrect) {
      deductItem('skips');
      playSound('powerup');
      if (currentLevel + 1 < questions.length) {
        setCurrentLevel(l => l + 1);
      } else {
        setGameState('victory');
      }
    }
  }, [skips, lastAnswerCorrect, currentLevel, questions.length, deductItem, setGameState]);

  const useShield = useCallback(() => {
    if (shields > 0 && !lastAnswerCorrect) {
      deductItem('shields');
      playSound('powerup');
      setSnarkyMessage("Shield activated! One hit absorbed.");
    }
  }, [shields, lastAnswerCorrect, deductItem]);

  const quitToMenu = useCallback(() => {
    setGameState('start');
  }, [setGameState]);

  const generateGame = useCallback(async (
    mode: string,
    difficulty: number,
    targetLang: Language,
    sourceLang: Language
  ) => {
    setGameState('loading');
    setLoadingMsg("The Owl is sharpening its claws...");

    let pool = basePhrases;
    if (difficulty > 0) {
      pool = basePhrases.filter(p => p.difficulty === difficulty || p.difficulty === difficulty - 1 || p.difficulty === difficulty + 1);
    }
    
    let selectedCount = 20;
    if (mode === 'speedrun') selectedCount = 30;
    else if (mode === 'daily') selectedCount = 15;
    else if (mode === 'practice') selectedCount = 40;
    else if (mode === 'maniac') selectedCount = 25;

    const selectedBase = shuffleArray(pool).slice(0, selectedCount);
    
    if (mode === 'maniac') {
      const maniacQuestions = await generateManiacQuestions(selectedBase);
      setQuestions(maniacQuestions);
      startNewGame();
      return;
    }

    const englishTexts = selectedBase.map(p => p.text);
    setLoadingMsg(`Summoning ${targetLang.name} spirits...`);
    
    const { displayPhrases, correctTranslations, allTranslations, pinyins } = await translateGamePhrases(
      englishTexts,
      sourceLang.code,
      targetLang.code
    );

    const newQuestions: Question[] = selectedBase.map((phrase, i) => {
      const display = displayPhrases[i] || phrase.text;
      const correct = correctTranslations[i] || display;
      
      const pool = shuffleArray([...correctTranslations, ...allTranslations])
        .filter(t => t && t !== correct && t.length > 1)
        .slice(0, 3);
        
      while (pool.length < 3) {
        pool.push(`Phrase ${pool.length + 100}`);
      }

      return {
        english: display,
        translation: correct,
        options: shuffleArray([correct, ...pool]),
        snarkyRemark: phrase.snarkyRemark,
        difficulty: phrase.difficulty,
        fromLang: sourceLang.code,
        toLang: targetLang.code,
        pinyin: pinyins?.[i] || ''
      };
    });

    setQuestions(newQuestions);
    setSamplePhrase(displayPhrases[0] || "");
    setSampleTranslation(correctTranslations[0] || "");
    startNewGame();
  }, [setGameState]);

  const generateManiacQuestions = async (phrases: any[]) => {
    const allLangs = languages.filter(l => l.code !== 'en');
    const results: Question[] = [];
    
    for (let i = 0; i < phrases.length; i++) {
      setLoadingMsg(`Maniac Mode: Chaos Loading... (${i + 1}/${phrases.length})`);
      const from = shuffleArray([...allLangs])[0];
      const to = shuffleArray([...allLangs].filter(l => l.code !== from.code))[0];
      
      const { displayPhrases, correctTranslations, pinyins } = await translateGamePhrases(
        [phrases[i].text],
        from.code,
        to.code
      );

      const distractors = await translateGamePhrases(
        [phrases[(i+1)%phrases.length].text, phrases[(i+2)%phrases.length].text],
        'en',
        to.code
      );

      results.push({
        english: displayPhrases[0] || phrases[i].text,
        translation: correctTranslations[0] || phrases[i].text,
        options: shuffleArray([correctTranslations[0], ...distractors.correctTranslations]),
        snarkyRemark: phrases[i].snarkyRemark,
        difficulty: phrases[i].difficulty,
        fromLang: from.code,
        toLang: to.code,
        pinyin: pinyins?.[0] || ''
      });
    }
    return results;
  };

  const startNewGame = () => {
    setLives(3);
    setCurrentLevel(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLastAnswerCorrect(null);
    setSelectedOption(null);
    setGameState('playing');
    playSound('click');
  };

  const currentPinyins = currentQuestion?.pinyin ? [currentQuestion.pinyin] : [];

  return {
    questions, currentLevel, currentOptions, lives, score, streak, maxStreak, timeLeft, timerFrozen,
    hints, freezes, skips, shields,
    eliminatedOptions, lastAnswerCorrect, selectedOption, snarkyMessage,
    shake, loadingMsg, samplePhrase, sampleTranslation, pointsEarned, currentPinyins,
    generateGame, handleAnswer, useHint, useFreeze, useSkip, useShield, quitToMenu,
  };
};
