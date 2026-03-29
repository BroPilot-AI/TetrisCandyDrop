export interface ScoreEntry {
  score: number;
  level: number;
  lines: number;
  date: string;
}

const KEY = 'candyDropScores';
const MAX = 10;

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}

export function addScore(score: number, level: number, lines: number): ScoreEntry[] {
  const entry: ScoreEntry = {
    score,
    level,
    lines,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    }),
  };
  const updated = [...loadScores(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // storage full — best effort
  }
  return updated;
}

export function getTopScore(): number {
  return loadScores()[0]?.score ?? 0;
}
