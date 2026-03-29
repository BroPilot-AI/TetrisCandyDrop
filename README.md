# Candy Drop 🍬

A pastel-styled Tetris clone built with React, TypeScript, and Vite. Full classic Tetris rules wrapped in a candy-pink aesthetic.

![Candy Drop](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-4-646cff?style=flat-square&logo=vite)

---

## Features

- **All 7 tetrominoes** with correct SRS rotations and wall kicks
- **Ghost piece** showing where the active piece will land
- **Hard drop** (instant), **soft drop**, and **DAS** auto-repeat on held keys
- **7-bag randomiser** — no piece droughts
- **Line-clear scoring** — 100 / 300 / 500 / 800 × level for 1–4 lines
- **Level progression** every 10 lines, gravity accelerates up to 50 ms/drop
- **High score** persisted to `localStorage`
- **Pause and restart** at any time
- Pastel candy colour palette with beveled cell shading

---

## Getting Started

**Requirements:** Node 18+

```bash
git clone https://github.com/BroPilot-AI/TetrisCandyDrop.git
cd TetrisCandyDrop
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Controls

| Key | Action |
|-----|--------|
| `←` `→` | Move left / right |
| `↓` | Soft drop |
| `Space` | Hard drop |
| `↑` or `X` | Rotate clockwise |
| `Z` | Rotate counter-clockwise |
| `P` / `Esc` | Pause / resume |
| `R` | Restart |

---

## Project Structure

```
src/
├── components/
│   ├── Board.tsx             # 10×20 CSS grid renderer with ghost piece
│   ├── NextPiecePreview.tsx  # 3-piece queue display
│   └── ScorePanel.tsx        # Score, high score, level, lines, controls
├── hooks/
│   └── useGame.ts            # useReducer state, gravity timer, keyboard DAS
├── utils/
│   ├── board.ts              # Pure functions: collision, locking, line-clear, rotation
│   └── tetrominoes.ts        # SRS shape tables, candy colours, 7-bag shuffle
├── App.tsx
├── App.css
└── main.tsx
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

---

## Scoring

| Lines cleared | Points |
|---------------|--------|
| 1 | 100 × level |
| 2 | 300 × level |
| 3 | 500 × level |
| 4 (Tetris) | 800 × level |

Hard drop also awards **2 points per cell** dropped.
