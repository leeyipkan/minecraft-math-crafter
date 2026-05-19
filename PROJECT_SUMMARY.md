# Project Document: Minecraft Math Crafter

## 1. Project Overview
**Minecraft Math Crafter** is an educational mobile-friendly web application designed for 6-year-olds to practice basic mathematics (counting, addition, and subtraction) within a familiar Minecraft-inspired aesthetic.

## 2. Technical Design
### Tech Stack
- **Framework:** React 18 with Vite
- **Language:** TypeScript (for type safety and better developer experience)
- **Styling:** Vanilla CSS with a focus on "pixelated" rendering (`image-rendering: pixelated`)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
- **Storage:** Browser `localStorage` for persisting high scores and game history.

### Architecture
The application is structured as a Single Page Application (SPA) with a central state controlling which "Screen" is active:
- **App.tsx:** Root component managing navigation state (`MENU`, `GAME`, `RESULTS`, `LEADERBOARD`).
- **MainMenu.tsx:** Entry point with navigation to the Game and Leaderboard.
- **Game.tsx:** The core engine. It handles:
    - Procedural generation of 10 math problems per session.
    - Interactive "Item Collection" logic (tactile clicking instead of typing).
    - Session timer and accuracy tracking.
- **Results.tsx:** Post-game summary and user identification for record-keeping.
- **Leaderboard.tsx:** Historical data visualization using sorted `localStorage` data.

## 3. Game Logic & Implementation
### Math Engine
The engine generates age-appropriate problems where the answer is always between 1 and 10 (or up to 11 for addition):
- **Addition:** `a + b = ?` where `a` and `b` are small integers.
- **Subtraction:** `a - b = ?` ensuring `a >= b` so the result is never negative.

### Interactive "Chest" Mechanic
To make the game accessible for a 6-year-old, we replaced traditional text inputs with a "Crafting" mechanic:
1. **Item Source:** A grid of 15 interactive items (Apples 🍎).
2. **Collection:** Clicking an item increments the "Chest" count and shows a visual representation of the item inside the chest.
3. **Reset:** Clicking the chest itself clears the items (resetting to 0).
4. **Validation:** The "DONE" button compares the current chest count to the generated answer.

### Scoring & Time Tracking
- **Accuracy:** The game tracks `boolean` results for each of the 10 questions.
- **Timer:** A `useRef` based stopwatch tracks total completion time in seconds.
- **Persistence:** Records are saved as JSON objects in `localStorage`:
  ```json
  {
    "name": "PlayerName",
    "score": 10,
    "time": 45,
    "date": "2026-05-17T..."
  }
  ```

## 4. Visual Identity
The "Minecraft" look is achieved through:
- **Custom Font:** A pixelated typeface loaded via `@font-face`.
- **CSS Variables:** Earthy Minecraft color palette (`#866043` for dirt, `#56ad36` for grass).
- **UI Panels:** 4px borders with light/dark shading to mimic the classic Minecraft inventory/menu style.

## 5. Operating Instructions
### Prerequisites
- Node.js installed.

### Commands
1. **Initialize/Start Server:**
   ```bash
   cd minecraft-math-crafter
   npm.cmd run dev
   ```
2. **Access via Browser:**
   Go to `http://localhost:5173/`

---
*Created on Sunday, May 17, 2026 for the Math Learning Mobile Game Project.*
