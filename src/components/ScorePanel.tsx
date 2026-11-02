interface Props {
  score: number;
  highScore: number;
  level: number;
  lines: number;
}

export function ScorePanel({ score, highScore, level, lines }: Props) {
  return (
    <div className="side-panel">
      <Stat label="Score" value={score.toLocaleString()} />
      <Stat label="Best" value={highScore.toLocaleString()} />
      <Stat label="Level" value={String(level)} />
      <Stat label="Lines" value={String(lines)} />
      <div className="controls-hint">
        <p>← → Move</p>
        <p>↓ Soft drop</p>
        <p>Space Hard drop</p>
        <p>↑ / X Rotate</p>
        <p>Z Rotate CCW</p>
        <p>P Pause</p>
        <p>R Restart</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
