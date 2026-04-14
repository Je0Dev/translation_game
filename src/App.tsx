import { useState } from 'react';
import { ShopItem } from './types/game';
import { speak } from './utils/sounds';
import { loadProgress } from './utils/progress';
import { useGameLogic, useGameState, useShop } from './hooks';
import {
  StartScreen,
  ModeScreen,
  ShopScreen,
  StatsScreen,
  LoadingScreen,
  GameScreen,
  GameOverScreen,
  VictoryScreen,
} from './components';

export default function App() {
  const [progress, setProgress] = useState(loadProgress());

  const {
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
  } = useGameState();

  const { purchaseItem } = useShop();

  const {
    questions,
    currentLevel,
    currentOptions,
    lives,
    score,
    streak,
    maxStreak,
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
    loadingMsg,
    samplePhrase,
    sampleTranslation,
    pointsEarned,
    currentPinyins,
    generateGame,
    handleAnswer,
    useHint,
    useFreeze,
    useSkip,
    useShield,
    quitToMenu,
  } = useGameLogic({
    gameState,
    gameMode,
    setProgress,
    setGameState: setGameState as any,
  });

  const handleStart = () => generateGame('classic', selectedDifficulty, toLanguage, fromLanguage);
  const handleSelectMode = (mode: string) => {
    setGameMode(mode);
    generateGame(mode as any, selectedDifficulty, toLanguage, fromLanguage);
  };

  const handlePurchase = (item: ShopItem) => {
    purchaseItem(item, progress, setProgress);
  };

  return (
    <div className={`min-h-screen bg-neutral-900 text-neutral-100 font-sans flex flex-col items-center justify-center p-4 pb-20 selection:bg-green-500/30 overflow-x-hidden transition-colors duration-1000 ${lives === 1 && gameState === 'playing' ? 'bg-red-950/20' : ''}`}>
      <div className={`fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${lives === 1 && gameState === 'playing' ? 'from-red-900/30 via-neutral-900 to-black animate-pulse' : 'from-neutral-800 via-neutral-900 to-black'} -z-10 transition-all duration-1000`}></div>
      
      {gameState === 'start' && (
        <StartScreen
          progress={progress}
          language={toLanguage}
          sourceLanguage={fromLanguage}
          setSourceLanguage={setFromLanguage}
          setLanguage={setToLanguage}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          onStart={handleStart}
          onVocab={() => setGameState('stats')}
          onGrammar={() => setGameState('stats')}
          onMode={() => setGameState('mode')}
          onShop={() => setGameState('shop')}
          onStats={() => setGameState('stats')}
        />
      )}

      {gameState === 'mode' && (
        <ModeScreen
          onSelectMode={handleSelectMode}
          onBack={() => setGameState('start')}
        />
      )}

      {gameState === 'shop' && (
        <ShopScreen
          progress={progress}
          onPurchase={handlePurchase}
          onBack={() => setGameState('start')}
        />
      )}

      {gameState === 'stats' && (
        <StatsScreen
          progress={progress}
          onBack={() => setGameState('start')}
        />
      )}

      {gameState === 'loading' && (
        <LoadingScreen
          message={loadingMsg}
          onCancel={quitToMenu}
          fromLanguage={fromLanguage}
          toLanguage={toLanguage}
          samplePhrase={samplePhrase}
          sampleTranslation={sampleTranslation}
        />
      )}

      {gameState === 'playing' && questions[currentLevel] && (
        <GameScreen
          questions={questions}
          currentLevel={currentLevel}
          currentOptions={currentOptions}
          lives={lives}
          score={score}
          streak={streak}
          timeLeft={timeLeft}
          timerFrozen={timerFrozen}
          hints={hints}
          freezes={freezes}
          skips={skips}
          shields={shields}
          eliminatedOptions={eliminatedOptions}
          lastAnswerCorrect={lastAnswerCorrect}
          selectedOption={selectedOption}
          snarkyMessage={snarkyMessage}
          shake={shake}
          language={toLanguage}
          sourceLanguage={fromLanguage}
          onAnswer={handleAnswer}
          onQuit={quitToMenu}
          onHint={useHint}
          onFreeze={useFreeze}
          onSkip={useSkip}
          onShield={useShield}
          onSpeak={(text) => speak(text, fromLanguage.code)}
          pointsEarned={pointsEarned}
          pinyins={questions[currentLevel]?.pinyin ? [questions[currentLevel].pinyin] : currentPinyins}
        />
      )}

      {gameState === 'gameover' && (
        <GameOverScreen
          currentLevel={currentLevel}
          score={score}
          maxStreak={maxStreak}
          totalQuestions={questions.length}
          onTryAgain={quitToMenu}
        />
      )}

      {gameState === 'victory' && (
        <VictoryScreen
          questionsLength={questions.length}
          score={score}
          maxStreak={maxStreak}
          onContinue={quitToMenu}
        />
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 py-2 px-4 text-center">
        <a 
          href="https://je0dev.github.io/lang_website/#/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-neutral-500 hover:text-neutral-300 hover:underline"
        >
          More language learning resources at je0dev.github.io/lang_website
        </a>
        <p className="text-xs text-neutral-600 mt-1">
          © {new Date().getFullYear()} Translate Mania. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
