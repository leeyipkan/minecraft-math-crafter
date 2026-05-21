# Minecraft Math Crafter 🍎⛏️

An interactive, educational math game explicitly designed for 6-year-olds. Built with a familiar "Minecraft" pixel aesthetic, this game helps children practice basic addition, subtraction, and introductory algebraic thinking (finding missing numbers) without requiring keyboard typing skills.

## Features

*   **Visual Counting Mechanic:** Kids solve math problems by moving apples between the "Apple Tree" (source) and their "Chest" (target).
*   **Place Value Teaching:** Uses "Large Apples" (worth 10) and "Small Apples" (worth 1) to visually teach groupings for numbers greater than 10.
*   **Intuitive Controls:** Players can click individual apples to move them back and forth, or use the central Blue (➡️) and Red (⬅️) control boxes.
*   **Progressive Difficulty:** A quick 5-question game loop that increases in difficulty per level:
    *   *Level 1:* Simple single-digit addition/subtraction.
    *   *Level 2:* Two-digit minus one-digit subtraction.
    *   *Level 3 & 4:* Missing numbers in addition and subtraction (e.g., `7 + ? = 13`).
    *   *Level 5:* Randomized missing numbers with higher base values.
*   **Instant Feedback System:**
    *   **Correct Answers:** Displays an encouraging green inline message and automatically advances after 1.5 seconds.
    *   **Incorrect Answers:** Displays a red overlay showing the correct answer to ensure the child learns from the mistake before continuing.
*   **Visual Progress Tracker:** A top-screen UI tracking correct (⭐) and incorrect (❌) answers for the current session.
*   **Dual Timers:** Tracks both the time spent on the current question and the total time elapsed for the entire session.
*   **Persistent Leaderboard:** A fully functional Node.js/Express backend that persists high scores to a local `leaderboard.json` file.

## Tech Stack

*   **Frontend:** React 18, TypeScript, Vite, Vanilla CSS (CSS Grid/Flexbox).
*   **Backend:** Node.js, Express, TypeScript (`tsx`), Local file system storage.

## How to Run Locally

This project requires two active terminal sessions to run both the frontend game and the backend leaderboard API.

### 1. Start the Backend API
Navigate to the `server` directory, install dependencies, and start the development server:
```bash
cd server
npm install
npm run dev
```
*The backend API will run on `http://localhost:3001`*

### 2. Start the Frontend Game
In a new terminal window at the project root, install dependencies and start Vite:
```bash
npm install
npm run dev
```
*The frontend game will run on `http://localhost:5173`*

Open your browser to `http://localhost:5173` to play!
