import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data store for leaderboards
interface LeaderboardEntry {
  name: string;
  score: number;
  time: number;
  date: string;
}

let leaderboard: LeaderboardEntry[] = [];
const DATA_FILE = path.join(process.cwd(), 'leaderboard.json');

// Save data to file
const saveData = async () => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(leaderboard, null, 2));
  } catch (err) {
    console.error('Error saving leaderboard data:', err);
  }
};

// Load existing data from file
const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    
    // Filter out records older than 2 days (48 hours)
    const now = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    
    leaderboard = parsedData.filter((entry: LeaderboardEntry) => {
      if (!entry.date) return false;
      const entryTime = new Date(entry.date).getTime();
      return (now - entryTime) <= twoDaysInMs;
    });

    if (leaderboard.length < parsedData.length) {
      console.log(`Removed ${parsedData.length - leaderboard.length} records older than 2 days.`);
      await saveData();
    }

    console.log(`Loaded ${leaderboard.length} entries from storage.`);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('No existing leaderboard found, starting fresh.');
    } else {
      console.error('Error loading leaderboard data:', err);
    }
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Minecraft Math Crafter Server is running!' });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.post('/api/leaderboard', async (req, res) => {
  const entry: LeaderboardEntry = req.body;
  
  if (!entry.name || typeof entry.score !== 'number' || typeof entry.time !== 'number') {
    return res.status(400).json({ error: 'Invalid leaderboard entry data' });
  }

  // Only allow scores > 3
  if (entry.score <= 3) {
    return res.status(400).json({ error: 'Score must be higher than 3 to be recorded.' });
  }

  // Add date if not provided
  if (!entry.date) {
    entry.date = new Date().toISOString();
  }

  leaderboard.push(entry);
  
  // Sort by score (descending), then time (ascending)
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.time - b.time;
  });

  // Keep top 100
  leaderboard = leaderboard.slice(0, 100);

  // Persist the updated leaderboard to disk
  await saveData();

  res.status(201).json({ message: 'Entry added successfully', entry });
});

// Start the server
app.listen(PORT, async () => {
  await loadData();
  console.log(`Server is running on http://localhost:${PORT}`);
});
