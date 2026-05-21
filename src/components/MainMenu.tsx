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
        RDR2GTA6
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <button 
          className="minecraft-btn" 
          onClick={onStart}
          style={{ width: '300px' }}
        >
          PLAY RDR2
        </button>
        <button 
          className="minecraft-btn" 
          onClick={onLeaderboard}
          style={{ width: '300px', backgroundColor: '#555' }}
        >
          Who is the leader
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
