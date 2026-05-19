import React, { useState, useEffect } from 'react';

interface LeaderboardProps {
  onBack: () => void;
}

interface Record {
  name: string;
  score: number;
  time: number;
  date: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [sortedHistory, setSortedHistory] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setSortedHistory(data.slice(0, 10)); // Top 10
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch leaderboard", err);
        // Fallback to local
        const history: Record[] = JSON.parse(localStorage.getItem('math_crafter_history') || '[]');
        const sorted = [...history].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time - b.time;
        }).slice(0, 10);
        setSortedHistory(sorted);
        setLoading(false);
      });
  }, []);

  return (
    <div className="minecraft-panel" style={{ width: '90%', maxWidth: '600px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>TOP SCORES</h2>
      
      {loading ? (
        <p style={{ margin: '40px 0' }}>Loading...</p>
      ) : sortedHistory.length === 0 ? (
        <p style={{ margin: '40px 0' }}>No records yet. Go play!</p>
      ) : (
        <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #373737' }}>
              <th style={{ padding: '10px' }}>NAME</th>
              <th style={{ padding: '10px' }}>SCORE</th>
              <th style={{ padding: '10px' }}>TIME</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((record, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #aaa' }}>
                <td style={{ padding: '10px' }}>{record.name}</td>
                <td style={{ padding: '10px' }}>{record.score}/5</td>
                <td style={{ padding: '10px' }}>{record.time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="minecraft-btn" onClick={onBack}>
        BACK
      </button>
    </div>
  );
};

export default Leaderboard;
