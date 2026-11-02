import { ScoreEntry } from '../utils/scores';

interface Props {
  scores: ScoreEntry[];
  highlightScore?: number;
}

export function HighScoreTable({ scores, highlightScore }: Props) {
  if (scores.length === 0) return null;

  return (
    <div className="score-table-wrap">
      <p className="panel-label">High Scores</p>
      <table className="score-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Lvl</th>
            <th>Lines</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((e, i) => (
            <tr key={i} className={e.score === highlightScore ? 'is-new' : ''}>
              <td className="rank">{i === 0 ? '👑' : i + 1}</td>
              <td>{e.score.toLocaleString()}</td>
              <td>{e.level}</td>
              <td>{e.lines}</td>
              <td>{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
