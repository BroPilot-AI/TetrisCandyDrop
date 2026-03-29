import { Board as BoardType, Piece, getDisplayBoard, getGhostPiece } from '../utils/board';

interface Props {
  board: BoardType;
  currentPiece: Piece | null;
}

export function Board({ board, currentPiece }: Props) {
  const ghost = currentPiece ? getGhostPiece(board, currentPiece) : null;
  const display = getDisplayBoard(board, currentPiece, ghost);

  return (
    <div className="board">
      {display.map((row, r) =>
        row.map((cell, c) => {
          const cls = cell.color
            ? cell.ghost ? 'cell ghost' : 'cell filled'
            : 'cell empty';

          return (
            <div
              key={`${r}-${c}`}
              className={cls}
              style={
                cell.color
                  ? {
                      backgroundColor: cell.ghost
                        ? `${cell.color}33`
                        : cell.color,
                      borderColor: cell.ghost
                        ? cell.color
                        : 'rgba(255,255,255,0.45)',
                    }
                  : undefined
              }
            />
          );
        })
      )}
    </div>
  );
}
