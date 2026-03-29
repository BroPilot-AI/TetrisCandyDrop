import { useGame } from './hooks/useGame';
import { useSwipe } from './hooks/useSwipe';
import { Board } from './components/Board';
import { NextPiecePreview } from './components/NextPiecePreview';
import { ScorePanel } from './components/ScorePanel';
import { Menu } from './components/Menu';
import { GameOver } from './components/GameOver';
import { TouchControls } from './components/TouchControls';
import { Sparkles } from './components/Sparkles';
import './App.css';

export default function App() {
  const { state, dispatch } = useGame();
  const swipeHandlers = useSwipe(dispatch);

  // ── Full-page screens ──────────────────────────────────────────────────────
  if (state.phase === 'menu') return <Menu dispatch={dispatch} />;
  if (state.phase === 'gameover') {
    return (
      <GameOver
        score={state.score}
        level={state.level}
        lines={state.lines}
        dispatch={dispatch}
      />
    );
  }

  // ── Game view (playing | paused) ───────────────────────────────────────────
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

        <div className="board-wrapper" {...swipeHandlers}>
          <Board board={state.board} currentPiece={state.current} />

          {/* Sparkle particles — remounted via key on each line clear */}
          {state.sparkleKey > 0 && <Sparkles key={state.sparkleKey} />}

          {/* Pause overlay */}
          {state.phase === 'paused' && (
            <div className="overlay">
              <h2>Paused</h2>
              <div className="overlay-btns">
                <button className="btn-primary"   onClick={() => dispatch({ type: 'PAUSE' })}>
                  Resume
                </button>
                <button className="btn-secondary" onClick={() => dispatch({ type: 'START' })}>
                  Restart
                </button>
                <button className="btn-secondary" onClick={() => dispatch({ type: 'RESTART' })}>
                  Main Menu
                </button>
              </div>
            </div>
          )}
        </div>

        <NextPiecePreview pieces={state.nextPieces} />
      </div>

      {/* On-screen touch controls — hidden on pointer:fine devices via CSS */}
      <TouchControls dispatch={dispatch} />
    </div>
  );
}
