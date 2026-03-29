import { loadScores } from '../utils/scores';
import { HighScoreTable } from './HighScoreTable';
import { Action } from '../hooks/useGame';

interface Props {
  dispatch: (a: Action) => void;
}

export function Menu({ dispatch }: Props) {
  const scores = loadScores();

  return (
    <div className="menu-page">
      <h1 className="menu-title">Candy Drop</h1>
      <p className="menu-sub">A sweet Tetris experience 🍬</p>

      <button
        className="btn-primary"
        onClick={() => dispatch({ type: 'START' })}
        autoFocus
      >
        Play
      </button>

      <HighScoreTable scores={scores} />

      <div className="menu-keys">
        <p>← → Move &nbsp;|&nbsp; ↓ Soft drop &nbsp;|&nbsp; Space Hard drop</p>
        <p>↑ / X Rotate CW &nbsp;|&nbsp; Z Rotate CCW &nbsp;|&nbsp; P Pause &nbsp;|&nbsp; R Menu</p>
      </div>
    </div>
  );
}
