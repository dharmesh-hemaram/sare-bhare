import type { Player } from '../types';

export type GamePhase = 'placing' | 'moving';

export interface GameState {
  currentPlayer: Player;
  gamePhase: GamePhase;
  p1Placed: number;
  p2Placed: number;
  selectedPiece: number | null;
  isMill: boolean;
  millNodes: readonly number[];
  winner: Player | null;
  skipMessage: string | null;
}

export interface MillFormationResult {
  isFormed: boolean;
  combination?: readonly number[];
}

export interface MoveValidationResult {
  isValid: boolean;
  reason?: string;
}
