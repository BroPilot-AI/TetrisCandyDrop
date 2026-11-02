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
import { addScore, getTopScore } from '../utils/scores';

// ── Types ────────────────────────────────────────────────────────────────────

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  board: Board;
  current: Piece | null;
  bag: TetrominoType[];
  nextPieces: TetrominoType[];
  score: number;
  highScore: number;
  level: number;
  lines: number;
  phase: GamePhase;
  sparkleKey: number; // increments on each line clear; used as React key to remount Sparkles
}

export type Action =
  | { type: 'START' }
  | { type: 'RESTART' }
  | { type: 'PAUSE' }
  | { type: 'MOVE'; dx: number; dy: number }
  | { type: 'ROTATE'; dir: 1 | -1 }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' };

// ── Bag helpers ──────────────────────────────────────────────────────────────

function pullFromBag(bag: TetrominoType[]): { piece: TetrominoType; bag: TetrominoType[] } {
  if (bag.length === 0) {
    const fresh = shuffleBag();
    return { piece: fresh[0], bag: fresh.slice(1) };
  }
  return { piece: bag[0], bag: bag.slice(1) };
}

// ── State factories ──────────────────────────────────────────────────────────

function makePlayingState(): GameState {
  const all = [...shuffleBag(), ...shuffleBag()]; // 14 pieces
  return {
    board: createEmptyBoard(),
    current: spawnPiece(all[0]),
    bag: all.slice(4),
    nextPieces: all.slice(1, 4),
    score: 0,
    highScore: getTopScore(),
    level: 1,
    lines: 0,
    phase: 'playing',
    sparkleKey: 0,
  };
}

function initState(): GameState {
  return { ...makePlayingState(), current: null, phase: 'menu' };
}

// ── Lock + spawn (pure) ──────────────────────────────────────────────────────

function lockAndSpawn(state: GameState): GameState {
  if (!state.current) return state;

  const locked = lockPiece(state.board, state.current);
  const { board: cleared, linesCleared } = clearLines(locked);
  const newLines = state.lines + linesCleared;
  const newScore = state.score + calcScore(linesCleared, state.level);
  const newLevel = calcLevel(newLines);
  const sparkleKey = linesCleared > 0 ? state.sparkleKey + 1 : state.sparkleKey;

  const nextType = state.nextPieces[0] as TetrominoType;
  const { piece: bagPiece, bag: newBag } = pullFromBag(state.bag);
  const newNextPieces = [...state.nextPieces.slice(1), bagPiece];
  const nextPiece = spawnPiece(nextType);

  if (!isValidPosition(cleared, nextPiece)) {
    const scores = addScore(newScore, newLevel, newLines);
    const newHigh = scores.length > 0 ? scores[0].score : newScore;
    return {
      ...state,
      board: cleared,
      current: null,
      score: newScore,
      highScore: newHigh,
      lines: newLines,
      level: newLevel,
      sparkleKey,
      phase: 'gameover',
    };
  }

  return {
    ...state,
    board: cleared,
    current: nextPiece,
    bag: newBag,
    nextPieces: newNextPieces,
    score: newScore,
    level: newLevel,
    lines: newLines,
    sparkleKey,
  };
}

// ── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESTART': return initState();
    case 'START':   return makePlayingState();
    case 'PAUSE':
      if (state.phase === 'playing') return { ...state, phase: 'paused' };
      if (state.phase === 'paused')  return { ...state, phase: 'playing' };
      return state;
  }

  if (state.phase !== 'playing' || !state.current) return state;

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

    case 'ROTATE':
      return { ...state, current: rotatePiece(state.board, state.current, action.dir) };

    case 'HARD_DROP': {
      const ghost = getGhostPiece(state.board, state.current);
      return lockAndSpawn({
        ...state,
        current: ghost,
        score: state.score + (ghost.y - state.current.y) * 2,
      });
    }

    case 'TICK': {
      const fallen: Piece = { ...state.current, y: state.current.y + 1 };
      if (isValidPosition(state.board, fallen)) return { ...state, current: fallen };
      return lockAndSpawn(state);
    }

    default:
      return state;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Gravity — recreated when level or phase changes
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const id = window.setInterval(
      () => dispatch({ type: 'TICK' }),
      calcGravityMs(state.level)
    );
    return () => window.clearInterval(id);
  }, [state.level, state.phase]);

  // Keyboard with DAS auto-repeat
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
          dispatch({ type: 'ROTATE', dir:  1 }); break;
        case 'z': case 'Z':
          dispatch({ type: 'ROTATE', dir: -1 }); break;
        case ' ':
          dispatch({ type: 'HARD_DROP' }); break;
        case 'p': case 'P': case 'Escape':
          dispatch({ type: 'PAUSE' }); break;
        case 'Enter':
          dispatch({ type: 'START' }); break;
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
          intervals.set(e.key, window.setInterval(() => press(e.key), 50));
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
