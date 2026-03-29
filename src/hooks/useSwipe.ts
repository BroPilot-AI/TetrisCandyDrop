import { useCallback, useRef } from 'react';
import { Action } from './useGame';

const MIN_DIST = 35; // px

export function useSwipe(dispatch: (a: Action) => void) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const s = start.current;
      if (!s) return;
      start.current = null;

      const t = e.changedTouches[0];
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      const dt = Date.now() - s.t;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);

      // Tap → rotate CW
      if (ax < 12 && ay < 12 && dt < 250) {
        dispatch({ type: 'ROTATE', dir: 1 });
        return;
      }

      if (ax >= MIN_DIST && ax > ay) {
        // Horizontal swipe → move
        dispatch({ type: 'MOVE', dx: dx > 0 ? 1 : -1, dy: 0 });
      } else if (ay >= MIN_DIST && dy > 0 && ay > ax) {
        // Downward swipe: fast = hard drop, slow = soft drop
        if (dt < 200) {
          dispatch({ type: 'HARD_DROP' });
        } else {
          dispatch({ type: 'MOVE', dx: 0, dy: 1 });
        }
      }
    },
    [dispatch]
  );

  return { onTouchStart, onTouchEnd };
}
