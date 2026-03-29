import { useEffect, useReducer } from 'react';
import {
  Board,
  Piece,
  createEmptyBoard,
  isValidPosition,
  lockPiece,
  clearLines,
  getGhostPiece,
  spawnPiece,
  rotatePiece,
  calcScore,
  calcLevel,
  calcGravityMs,
} from '../utils/board';
import { TetrominoType, shuffleBag } from '../utils/tetrominoes';

export interface GameState {
  board: Board;
  current: Piece | null;
  bag: TetrominoType[];
  nextPieces: TetrominoType[]; // always 3 items
  score: number;
  highScore: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Action =
  | { type: 'MOVE'; dx: number; dy: number }
  | { type: 'ROTATE'; dir: 1 | -1 }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESTART' };

// ---- Bag helpers (pure, immutable) ----------------------------------------

function pullFromBag(bag: TetrominoType[]): { piece: TetrominoType; bag: TetrominoType[] } {
  if (bag.length === 0) {
    const fresh = shuffleBag();
    return { piece: fresh[0], bag: fresh.slice(1) };
  }
  return { piece: bag[0], bag: bag.slice(1) };
}

// ---- State initialiser -----------------------------------------------------

function initState(): GameState {
  const a = shuffleBag();
  const b = shuffleBag();
  const all = [...a, ...b]; // 14 pieces

  const highScore = Number(localStorage.getItem('candyTetrisHigh') ?? 0);

  return {
    board: createEmptyBoard(),
    current: spawnPiece(all[0]),
    bag: all.slice(4),        // 10 remaining
    nextPieces: all.slice(1, 4) as [TetrominoType, TetrominoType, TetrominoType],
    score: 0,
    highScore,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: false,
  };
}

// ---- Lock + spawn helper (used by TICK and HARD_DROP) ----------------------

function lockAndSpawn(state: GameState): GameState {
  if (!state.current) return state;

  const locked = lockPiece(state.board, state.current);
  const { board: cleared, linesCleared } = clearLines(locked);
  const newLines = state.lines + linesCleared;
  const newLevel = calcLevel(newLines);
  const newScore = state.score + calcScore(linesCleared, state.level);
  const newHigh = Math.max(newScore, state.highScore);

  if (newHigh > state.highScore) {
    localStorage.setItem('candyTetrisHigh', String(newHigh));
  }

  // nextPieces always has at least 1 item (invariant maintained below)
  const nextType = state.nextPieces[0] as TetrominoType;
  const { piece: bagPiece, bag: newBag } = pullFromBag(state.bag);
  const newNextPieces = [...state.nextPieces.slice(1), bagPiece] as [
    TetrominoType,
    TetrominoType,
    TetrominoType,
  ];

  const nextPiece = spawnPiece(nextType);

  if (!isValidPosition(cleared, nextPiece)) {
    return {
      ...state,
      board: cleared,
      current: null,
      score: newScore,
      highScore: newHigh,
      lines: newLines,
      level: newLevel,
      isGameOver: true,
    };
  }

  return {
    ...state,
    board: cleared,
    current: nextPiece,
    bag: newBag,
    nextPieces: newNextPieces,
    score: newScore,
    highScore: newHigh,
    lines: newLines,
    level: newLevel,
  };
}

// ---- Reducer ---------------------------------------------------------------

function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'RESTART') return initState();
  if (action.type === 'PAUSE') return { ...state, isPaused: !state.isPaused };
  if (state.isGameOver || state.isPaused || !state.current) return state;

  switch (action.type) {
    case 'MOVE': {
      const moved: Piece = {
        ...state.current,
        x: state.current.x + action.dx,
        y: state.current.y + action.dy,
      };
      if (!isValidPosition(state.board, moved)) return state;
      return { ...state, current: moved };
    }

    case 'ROTATE': {
      const rotated = rotatePiece(state.board, state.current, action.dir);
      return { ...state, current: rotated };
    }

    case 'HARD_DROP': {
      const ghost = getGhostPiece(state.board, state.current);
      const dropBonus = (ghost.y - state.current.y) * 2;
      return lockAndSpawn({
        ...state,
        current: ghost,
        score: state.score + dropBonus,
      });
    }

    case 'TICK': {
      const fallen: Piece = { ...state.current, y: state.current.y + 1 };
      if (isValidPosition(state.board, fallen)) {
        return { ...state, current: fallen };
      }
      return lockAndSpawn(state);
    }

    default:
      return state;
  }
}

// ---- Hook ------------------------------------------------------------------

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Gravity — recreated whenever level/pause/gameover changes
  useEffect(() => {
    if (state.isGameOver || state.isPaused) return;
    const ms = calcGravityMs(state.level);
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), ms);
    return () => window.clearInterval(id);
  }, [state.level, state.isPaused, state.isGameOver]);

  // Keyboard controls with DAS (Delayed Auto Shift)
  useEffect(() => {
    const held = new Set<string>();
    const delays = new Map<string, number>();
    const intervals = new Map<string, number>();

    function press(key: string) {
      switch (key) {
        case 'ArrowLeft':  dispatch({ type: 'MOVE', dx: -1, dy: 0 }); break;
        case 'ArrowRight': dispatch({ type: 'MOVE', dx:  1, dy: 0 }); break;
        case 'ArrowDown':  dispatch({ type: 'MOVE', dx:  0, dy: 1 }); break;
        case 'ArrowUp': case 'x': case 'X':
          dispatch({ type: 'ROTATE', dir: 1 }); break;
        case 'z': case 'Z':
          dispatch({ type: 'ROTATE', dir: -1 }); break;
        case ' ':
          dispatch({ type: 'HARD_DROP' }); break;
        case 'p': case 'P': case 'Escape':
          dispatch({ type: 'PAUSE' }); break;
        case 'r': case 'R':
          dispatch({ type: 'RESTART' }); break;
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (held.has(e.key)) return;
      held.add(e.key);
      press(e.key);

      if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        const d = window.setTimeout(() => {
          const i = window.setInterval(() => press(e.key), 50);
          intervals.set(e.key, i);
        }, 150);
        delays.set(e.key, d);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      held.delete(e.key);
      const d = delays.get(e.key);
      if (d !== undefined) { window.clearTimeout(d); delays.delete(e.key); }
      const i = intervals.get(e.key);
      if (i !== undefined) { window.clearInterval(i); intervals.delete(e.key); }
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      delays.forEach(id => window.clearTimeout(id));
      intervals.forEach(id => window.clearInterval(id));
    };
  }, []);

  return { state, dispatch };
}
