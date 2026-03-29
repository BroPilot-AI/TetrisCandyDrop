import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { NextPiecePreview } from './components/NextPiecePreview';
import { ScorePanel } from './components/ScorePanel';
import './App.css';

export default function App() {
  const { state, dispatch } = useGame();

  return (
    <div className="app">
      <h1 className="title">Candy Drop</h1>

      <div className="game-container">
        <ScorePanel
          score={state.score}
          highScore={state.highScore}
          level={state.level}
          lines={state.lines}
        />

        <div className="board-wrapper">
          <Board board={state.board} currentPiece={state.current} />

          {state.isGameOver && (
            <div className="overlay">
              <h2>Game Over</h2>
              <p>Score: {state.score.toLocaleString()}</p>
              <button onClick={() => dispatch({ type: 'RESTART' })}>
                Play Again
              </button>
            </div>
          )}

          {state.isPaused && !state.isGameOver && (
            <div className="overlay">
              <h2>Paused</h2>
              <button onClick={() => dispatch({ type: 'PAUSE' })}>
                Resume
              </button>
            </div>
          )}
        </div>

        <NextPiecePreview pieces={state.nextPieces} />
      </div>
    </div>
  );
}
