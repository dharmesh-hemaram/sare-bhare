import { ADJACENCY_MAP, GAME_CONFIG, MILL_COMBINATIONS } from '../constants/gameConstants';
import type { NodeData, Player } from '../types';
import type { MillFormationResult, MoveValidationResult } from '../types/gameTypes';

/**
 * Checks if a mill is formed after placing a piece at the given position
 */
export const checkMillFormation = (
  nodes: readonly NodeData[],
  playerId: number,
  currentPlayer: Player
): MillFormationResult => {
  const formedMillCombination = MILL_COMBINATIONS.find(combination =>
    combination.includes(playerId) && 
    combination.every(position => nodes[position].occupiedBy === currentPlayer)
  );

  return {
    isFormed: Boolean(formedMillCombination),
    combination: formedMillCombination,
  };
};

/**
 * Checks if a player has any valid moves available
 */
export const hasValidMoves = (
  nodes: readonly NodeData[],
  player: Player
): boolean => {
  const playerPieces = nodes.filter(node => node.occupiedBy === player);
  
  return playerPieces.some(piece => {
    const adjacentPositions = ADJACENCY_MAP[piece.id] || [];
    return adjacentPositions.some(adjacentPosition => {
      const adjacentNode = nodes.find(node => node.id === adjacentPosition);
      return adjacentNode && adjacentNode.occupiedBy === null;
    });
  });
};

/**
 * Validates if a move from source to destination is legal
 */
export const validateMove = (
  sourceId: number,
  destinationId: number,
  nodes: readonly NodeData[]
): MoveValidationResult => {
  const destinationNode = nodes.find(node => node.id === destinationId);
  
  if (!destinationNode) {
    return { isValid: false, reason: 'Invalid destination' };
  }
  
  if (destinationNode.occupiedBy !== null) {
    return { isValid: false, reason: 'Destination is occupied' };
  }
  
  const adjacentPositions = ADJACENCY_MAP[sourceId];
  if (!adjacentPositions?.includes(destinationId)) {
    return { isValid: false, reason: 'Not adjacent positions' };
  }
  
  return { isValid: true };
};

/**
 * Checks if a player has won the game
 */
export const checkWinCondition = (nodes: readonly NodeData[]): Player | null => {
  const p1Pieces = nodes.filter(node => node.occupiedBy === 'P1').length;
  const p2Pieces = nodes.filter(node => node.occupiedBy === 'P2').length;
  
  if (p1Pieces <= GAME_CONFIG.MIN_PIECES_TO_LOSE && p1Pieces > 0) {
    return 'P2';
  }
  
  if (p2Pieces <= GAME_CONFIG.MIN_PIECES_TO_LOSE && p2Pieces > 0) {
    return 'P1';
  }
  
  return null;
};

/**
 * Gets the count of pieces placed by a specific player
 */
export const getPlayerPieceCount = (
  nodes: readonly NodeData[],
  player: Player
): number => {
  return nodes.filter(node => node.occupiedBy === player).length;
};

/**
 * Checks if the game can transition to moving phase
 */
export const canTransitionToMovingPhase = (
  p1Placed: number,
  p2Placed: number
): boolean => {
  return p1Placed === GAME_CONFIG.MAX_PIECES_PER_PLAYER && 
         p2Placed === GAME_CONFIG.MAX_PIECES_PER_PLAYER;
};
