import { useState } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';

export type Screen = 'MENU' | 'GAME' | 'RESULTS' | 'LEADERBOARD';

export interface GameResult {
  score: number;
  time: number;
  questions: boolean[];
}

function App() {
  const [screen, setScreen] = useState<Screen>('MENU');
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const startGame = () => {
    setScreen('GAME');
  };

  const finishGame = (result: GameResult) => {
    setLastResult(result);
    setScreen('RESULTS');
  };

  const goToMenu = () => {
    setScreen('MENU');
  };

  const goToLeaderboard = () => {
    setScreen('LEADERBOARD');
  };

  return (
    <div className="app-container">
      <div className="pixel-bg" />
      {screen === 'MENU' && <MainMenu onStart={startGame} onLeaderboard={goToLeaderboard} />}
      {screen === 'GAME' && <Game onFinish={finishGame} onCancel={goToMenu} />}
      {screen === 'RESULTS' && lastResult && (
        <Results result={lastResult} onBackToMenu={goToMenu} onRestart={startGame} />
      )}
      {screen === 'LEADERBOARD' && <Leaderboard onBack={goToMenu} />}
    </div>
  );
}

export default App;
