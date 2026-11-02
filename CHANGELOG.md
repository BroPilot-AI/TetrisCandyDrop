# Changelog

All notable changes to Candy Drop are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] — 2026-03-29

### Added
- **Menu screen** — animated floating title on launch with a Play button and keyboard shortcut hints
- **Pause overlay** — Resume, Restart, and Main Menu actions accessible via `P` / `Esc` or the overlay buttons
- **Game-over screen** — score summary chips (Score / Level / Lines) with Play Again and Main Menu buttons
- **High-score table** — top 10 scores (score, level, lines, date) persisted to `localStorage`; table shown on both the menu and game-over screens; most recent entry highlighted
- **Line-clear sparkles** — 55 candy-coloured particles burst and fade over the board on every line clear; each clear remounts the component via an incrementing `sparkleKey` for a fresh animation
- **On-screen touch controls** — two-row D-pad shown automatically on touch (`pointer: coarse`) devices; Left / Right / Soft Drop have DAS auto-repeat; hidden on desktop
- **Swipe gestures** — tap the board to rotate, swipe left/right to move, fast swipe down for hard drop, slow swipe down for soft drop
- **Responsive layout** — side panels stack above the board and cells shrink to 26 px on screens narrower than 520 px

### Changed
- `isPaused: boolean` + `isGameOver: boolean` replaced by a single `GamePhase` enum (`menu | playing | paused | gameover`) for clean screen routing
- Keyboard `R` now returns to the Main Menu instead of restarting in-place; `Enter` starts or restarts the game from any screen

### Internal
- New `src/utils/scores.ts` — `loadScores`, `addScore`, `getTopScore` with try/catch around `localStorage`
- New `src/hooks/useSwipe.ts` — touch gesture detection hook
- New components: `Menu`, `GameOver`, `HighScoreTable`, `Sparkles`, `TouchControls`

---

## [1.0.0] — 2026-03-29

### Added
- All 7 tetrominoes with correct SRS rotation states (4 rotations each)
- Wall-kick rotation with horizontal and floor-kick offsets
- Ghost piece showing the landing position
- Hard drop (`Space`) with 2-point-per-cell bonus scoring
- Soft drop (`↓`) and DAS auto-repeat on all movement keys
- 7-bag randomiser — no piece droughts
- Line-clear scoring: 100 / 300 / 500 / 800 × level for 1–4 lines
- Level progression every 10 lines; gravity accelerates to a minimum of 50 ms per drop
- High score persisted to `localStorage` (single value, superseded by the table in v1.1.0)
- Pause (`P` / `Esc`) and restart (`R`) keyboard shortcuts
- Pastel candy colour palette with beveled inset cell shading
- 3-piece next-piece preview queue
- Next-piece preview and score / level / lines side panels

---

## [Unreleased]

- Nothing yet.
