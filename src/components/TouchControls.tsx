import { useRef } from 'react';
import { Action } from '../hooks/useGame';

// ── Single touch button with optional DAS auto-repeat ────────────────────────

interface TBtnProps {
  children: React.ReactNode;
  onPress: () => void;
  repeat?: boolean;
  wide?: boolean;
  label: string;
}

function TBtn({ children, onPress, repeat = false, wide = false, label }: TBtnProps) {
  const delayRef = useRef<number | null>(null);
  const intRef = useRef<number | null>(null);

  function start(e: React.PointerEvent) {
    e.preventDefault();
    onPress();
    if (!repeat) return;
    delayRef.current = window.setTimeout(() => {
      intRef.current = window.setInterval(onPress, 55);
    }, 175);
  }

  function stop() {
    if (delayRef.current !== null) {
      window.clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    if (intRef.current !== null) {
      window.clearInterval(intRef.current);
      intRef.current = null;
    }
  }

  return (
    <button
      className={`touch-btn${wide ? ' wide' : ''}`}
      aria-label={label}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      {children}
    </button>
  );
}

// ── Touch controls panel ─────────────────────────────────────────────────────

interface Props {
  dispatch: (a: Action) => void;
}

export function TouchControls({ dispatch }: Props) {
  return (
    <div className="touch-controls" aria-label="Touch controls">
      <div className="touch-row">
        <TBtn label="Move left"  repeat onPress={() => dispatch({ type: 'MOVE', dx: -1, dy: 0 })}>←</TBtn>
        <TBtn label="Rotate CCW"        onPress={() => dispatch({ type: 'ROTATE', dir: -1 })}>↺</TBtn>
        <TBtn label="Rotate CW"         onPress={() => dispatch({ type: 'ROTATE', dir: 1  })}>↻</TBtn>
        <TBtn label="Move right" repeat onPress={() => dispatch({ type: 'MOVE', dx:  1, dy: 0 })}>→</TBtn>
      </div>
      <div className="touch-row">
        <TBtn label="Soft drop" wide repeat onPress={() => dispatch({ type: 'MOVE', dx: 0, dy: 1 })}>
          ↓ Soft
        </TBtn>
        <TBtn label="Hard drop" wide        onPress={() => dispatch({ type: 'HARD_DROP' })}>
          ⬇ Drop
        </TBtn>
      </div>
    </div>
  );
}
