import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { dividerPositions, linePositions, nodePositions } from '../nodeMap';
import './Board.css';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { PlayerCard } from './PlayerCard';

export default function Board(): React.JSX.Element {
  const { gameState, nodes, actions } = useGameState(nodePositions);

  const handleNodeClick = (nodeId: number): void => {
    // Don't allow moves if game is over
    if (gameState.winner) return;

    // Handle mill removal phase
    if (gameState.isMill) {
      actions.handleRemovePiece(nodeId);
      return;
    }

    // Handle placing phase
    if (gameState.gamePhase === 'placing') {
      actions.handlePlacePiece(nodeId);
      return;
    }

    // Handle moving phase
    if (gameState.gamePhase === 'moving') {
      if (gameState.selectedPiece === null) {
        // Try to select a piece
        actions.handleSelectPiece(nodeId);
      } else {
        // Try to move the selected piece
        actions.handleMovePiece(nodeId);
      }
    }
  };

  return (
    <div className="game-container">
      {/* Player sections */}
      <div className="players-section">
        <PlayerCard
          player="P1"
          playerNumber={1}
          isActive={gameState.currentPlayer === 'P1'}
          isWinner={gameState.winner === 'P1'}
        />
        
        <PlayerCard
          player="P2"
          playerNumber={2}
          isActive={gameState.currentPlayer === 'P2'}
          isWinner={gameState.winner === 'P2'}
         
        />
      </div>

      {/* Game status */}
      <GameStatus
        gamePhase={gameState.gamePhase}
        selectedPiece={gameState.selectedPiece}
        isMill={gameState.isMill}
        winner={gameState.winner}
        skipMessage={gameState.skipMessage}
      />

      {/* Game board */}
      <GameBoard
        nodes={nodes}
        linePositions={linePositions}
        dividerPositions={dividerPositions}
        millNodes={gameState.millNodes}
        selectedPiece={gameState.selectedPiece}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
