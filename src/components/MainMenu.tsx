import React from 'react';

interface MainMenuProps {
  onStart: () => void;
  onLeaderboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onLeaderboard }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ 
        fontSize: '4rem', 
        marginBottom: '40px', 
        textShadow: '4px 4px #000',
        color: '#56ad36'
      }}>
        MINECRAFT<br/>MATH CRAFTER
      </h1>
      <button className="minecraft-btn" onClick={onStart}>
        PLAY
      </button>
      <div style={{ marginTop: '20px' }}>
        <button 
          className="minecraft-btn" 
          onClick={onLeaderboard}
          style={{ fontSize: '1rem', backgroundColor: '#555' }}
        >
          LEADERBOARD
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
