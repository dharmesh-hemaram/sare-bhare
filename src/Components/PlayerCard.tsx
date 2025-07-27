import React from 'react';
import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  playerNumber: number;
  isActive: boolean;
  isWinner: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  playerNumber,
  isActive,
  isWinner,
}) => {
  const playerIconClass = `player-icon-${player.toLowerCase()}`;
  const cardClasses = [
    'player-card',
    isActive && 'active',
    isWinner && 'winner',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <div className="player-icon">
        <svg width="30" height="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="12" className={playerIconClass} />
        </svg>
      </div>
      <div className="player-info">
        <h3>
          Player {playerNumber} {isWinner ? '👑' : ''}
        </h3>
      </div>
    </div>
  );
};
