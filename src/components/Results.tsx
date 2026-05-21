import { useState } from 'react';
import type { GameResult } from '../App';

interface ResultsProps {
  result: GameResult;
  onBackToMenu: () => void;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onBackToMenu, onRestart }) => {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    
    const record = {
      name: name.trim(),
      score: result.score,
      time: result.time,
      date: new Date().toISOString()
    };
    
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save to backend');
      }
    } catch (err) {
      console.error("Failed to save to backend, falling back to local storage", err);
      // Fallback
      const history = JSON.parse(localStorage.getItem('math_crafter_history') || '[]');
      history.push(record);
      localStorage.setItem('math_crafter_history', JSON.stringify(history));
    } finally {
      setSaved(true);
      setSaving(false);
    }
  };

  return (
    <div className="minecraft-panel" style={{ width: '90%', maxWidth: '500px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', color: result.score >= 4 ? '#56ad36' : '#a33' }}>
        LEVEL COMPLETE!
      </h2>
      
      <div style={{ margin: '30px 0', fontSize: '1.5rem' }}>
        <p>Score: {result.score} / 5</p>
        <p>Time: {result.time} seconds</p>
      </div>

      {result.score > 3 ? (
        !saved ? (
          <div style={{ marginBottom: '30px' }}>
            <p>Enter your name to save your score:</p>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PLAYER NAME"
              disabled={saving}
              style={{
                fontSize: '1.2rem',
                width: '80%',
                border: '4px solid #373737',
                padding: '10px',
                fontFamily: 'inherit',
                marginBottom: '10px'
              }}
            />
            <br/>
            <button className="minecraft-btn" onClick={handleSave} disabled={saving} style={{ fontSize: '1rem', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'SAVING...' : 'SAVE RECORD'}
            </button>
          </div>
        ) : (
          <p style={{ color: '#56ad36', marginBottom: '30px' }}>RECORD SAVED!</p>
        )
      ) : (
        <div style={{ marginBottom: '30px', color: '#777' }}>
          <p>Great effort!</p>
          <p style={{ fontSize: '1rem' }}>Score 4 or more to save your name to the leaderboard.</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button className="minecraft-btn" onClick={onRestart} style={{ fontSize: '1rem' }}>
          PLAY AGAIN
        </button>
        <button className="minecraft-btn" onClick={onBackToMenu} style={{ fontSize: '1rem', backgroundColor: '#555' }}>
          MENU
        </button>
      </div>
    </div>
  );
};

export default Results;
