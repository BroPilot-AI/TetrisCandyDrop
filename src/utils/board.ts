import { SHAPES, COLORS, TetrominoType } from './tetrominoes';

export const COLS = 10;
export const ROWS = 20;

export type Cell = { color: string; ghost?: boolean };
export type Board = Cell[][];

export interface Piece {
  type: TetrominoType;
  rotation: number;
  x: number; // column offset
  y: number; // row offset
}

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ color: '' }))
  );
}

/** Returns all [row, col] positions occupied by the piece. */
export function getPieceCells(piece: Piece): [number, number][] {
  const shape = SHAPES[piece.type][piece.rotation];
  const cells: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c]) {
        cells.push([piece.y + r, piece.x + c]);
      }
    }
  }
  return cells;
}

export function isValidPosition(board: Board, piece: Piece): boolean {
  return getPieceCells(piece).every(([r, c]) => {
    if (r < 0) return true; // above the board is allowed during spawn
    if (r >= ROWS || c < 0 || c >= COLS) return false;
    return board[r][c].color === '';
  });
}

export function lockPiece(board: Board, piece: Piece): Board {
  const color = COLORS[piece.type];
  const next = board.map(row => row.map(cell => ({ ...cell })));
  getPieceCells(piece).forEach(([r, c]) => {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      next[r][c] = { color };
    }
  });
  return next;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const kept = board.filter(row => row.some(cell => cell.color === ''));
  const linesCleared = ROWS - kept.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array.from({ length: COLS }, (): Cell => ({ color: '' }))
  );
  return { board: [...emptyRows, ...kept], linesCleared };
}

/** Returns the position where the piece would land if dropped straight down. */
export function getGhostPiece(board: Board, piece: Piece): Piece {
  let ghost = { ...piece };
  while (isValidPosition(board, { ...ghost, y: ghost.y + 1 })) {
    ghost = { ...ghost, y: ghost.y + 1 };
  }
  return ghost;
}

/** Merges locked board + ghost + active piece into a single display grid. */
export function getDisplayBoard(
  board: Board,
  piece: Piece | null,
  ghost: Piece | null
): Board {
  const display = board.map(row => row.map(cell => ({ ...cell })));

  if (ghost && piece && ghost.y !== piece.y) {
    getPieceCells(ghost).forEach(([r, c]) => {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && display[r][c].color === '') {
        display[r][c] = { color: COLORS[piece.type], ghost: true };
      }
    });
  }

  if (piece) {
    getPieceCells(piece).forEach(([r, c]) => {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        display[r][c] = { color: COLORS[piece.type] };
      }
    });
  }

  return display;
}

export function spawnPiece(type: TetrominoType): Piece {
  return { type, rotation: 0, x: 3, y: 0 };
}

/** Rotates piece with basic wall-kick offsets. Returns original piece if all kicks fail. */
export function rotatePiece(board: Board, piece: Piece, dir: 1 | -1): Piece {
  const newRotation = ((piece.rotation + dir) % 4 + 4) % 4;
  const rotated: Piece = { ...piece, rotation: newRotation };

  if (isValidPosition(board, rotated)) return rotated;

  // Wall-kick candidates
  for (const kick of [-1, 1, -2, 2]) {
    const kicked: Piece = { ...rotated, x: rotated.x + kick };
    if (isValidPosition(board, kicked)) return kicked;
    // Also try vertical kick for floor kicks
    const kickedUp: Piece = { ...rotated, x: rotated.x + kick, y: rotated.y - 1 };
    if (isValidPosition(board, kickedUp)) return kickedUp;
  }

  return piece; // can't rotate
}

export function calcScore(linesCleared: number, level: number): number {
  const base = [0, 100, 300, 500, 800];
  return (base[Math.min(linesCleared, 4)] ?? 0) * level;
}

export function calcLevel(totalLines: number): number {
  return Math.floor(totalLines / 10) + 1;
}

export function calcGravityMs(level: number): number {
  return Math.max(50, 1000 - (level - 1) * 90);
}
