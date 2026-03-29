import { TetrominoType, SHAPES, COLORS } from '../utils/tetrominoes';

function MiniGrid({ type }: { type: TetrominoType }) {
  const shape = SHAPES[type][0];
  const color = COLORS[type];

  return (
    <div className="mini-grid">
      {shape.map((row, r) =>
        row.map((filled, c) => (
          <div
            key={`${r}-${c}`}
            className="mini-cell"
            style={{ backgroundColor: filled ? color : 'transparent' }}
          />
        ))
      )}
    </div>
  );
}

interface Props {
  pieces: TetrominoType[];
}

export function NextPiecePreview({ pieces }: Props) {
  return (
    <div className="side-panel">
      <p className="panel-label">Next</p>
      {pieces.map((type, i) => (
        <MiniGrid key={i} type={type} />
      ))}
    </div>
  );
}
