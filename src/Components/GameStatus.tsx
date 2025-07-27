import React from 'react';
import type { GamePhase } from '../types/gameTypes';

interface GameStatusProps {
  gamePhase: GamePhase;
  selectedPiece: number | null;
  isMill: boolean;
  winner: string | null;
  skipMessage: string | null;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  gamePhase,
  selectedPiece,
  isMill,
  winner,
  skipMessage,
}) => {
  return (
    <div className="game-status">
      {winner && (
        <p style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '18px' }}>
          🎉 Player {winner === 'P1' ? '1' : '2'} Wins! 🎉
        </p>
      )}
      {!winner && isMill && (
        <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
          Mill formed! Remove opponent's piece.
        </p>
      )}
      {!winner && gamePhase === 'moving' && selectedPiece !== null && (
        <p style={{ color: '#4ecdc4' }}>
          Selected piece at position {selectedPiece}. Click an adjacent empty position to move.
        </p>
      )}
      {skipMessage && (
        <p style={{ color: '#ffa500', fontWeight: 'bold' }}>
          {skipMessage}
        </p>
      )}
    </div>
  );
};
