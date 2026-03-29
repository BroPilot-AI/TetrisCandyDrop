import { loadScores } from '../utils/scores';
import { HighScoreTable } from './HighScoreTable';
import { Action } from '../hooks/useGame';

interface Props {
  score: number;
  level: number;
  lines: number;
  dispatch: (a: Action) => void;
}

export function GameOver({ score, level, lines, dispatch }: Props) {
  const scores = loadScores();

  return (
    <div className="menu-page">
      <h1 className="menu-title">Game Over</h1>

      <div className="stat-chips">
        <Chip label="Score" value={score.toLocaleString()} highlight />
        <Chip label="Level" value={String(level)} />
        <Chip label="Lines" value={String(lines)} />
      </div>

      <div className="menu-btns">
        <button className="btn-primary" onClick={() => dispatch({ type: 'START' })}>
          Play Again
        </button>
        <button className="btn-secondary" onClick={() => dispatch({ type: 'RESTART' })}>
          Main Menu
        </button>
      </div>

      <HighScoreTable scores={scores} highlightScore={score} />
    </div>
  );
}

function Chip({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`stat-chip${highlight ? ' highlight' : ''}`}>
      <span className="chip-label">{label}</span>
      <span className="chip-value">{value}</span>
    </div>
  );
}
