import { useMemo } from 'react';

const CANDY = ['#FF9EBB', '#FFD57A', '#D4A5FF', '#A4E4D9', '#B8C4FF', '#FFA5B8', '#FFB347'];

interface Particle {
  id: number;
  color: string;
  left: number;
  top: number;
  size: number;
  delay: string;
  dur: string;
  tx: string;
}

export function Sparkles() {
  // Empty deps is intentional: component is remounted via `key` on each line clear,
  // so particles are freshly randomised on every animation.
  const particles = useMemo<Particle[]>( // eslint-disable-line react-hooks/exhaustive-deps
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        color: CANDY[i % CANDY.length],
        left: 3 + Math.random() * 94,
        top: 5 + Math.random() * 85,
        size: 4 + Math.floor(Math.random() * 8),
        delay: `${(Math.random() * 0.2).toFixed(2)}s`,
        dur: `${(0.45 + Math.random() * 0.35).toFixed(2)}s`,
        tx: `${Math.round((Math.random() - 0.5) * 60)}px`,
      })),
    []
  );

  return (
    <div className="sparkle-overlay" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="sparkle-dot"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              '--tx': p.tx,
              animationDelay: p.delay,
              animationDuration: p.dur,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
