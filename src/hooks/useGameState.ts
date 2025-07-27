import { useCallback, useEffect, useReducer, useState } from 'react';
import { GAME_CONFIG } from '../constants/gameConstants';
import type { NodeData, Player } from '../types';
import type { GamePhase, GameState } from '../types/gameTypes';
import {
    canTransitionToMovingPhase,
    checkMillFormation,
    checkWinCondition,
    hasValidMoves,
    validateMove
} from '../utils/gameLogic';

type GameAction =
  | { type: 'PLACE_PIECE'; payload: { nodeId: number; updatedNodes: NodeData[] } }
  | { type: 'MOVE_PIECE'; payload: { sourceId: number; destinationId: number; updatedNodes: NodeData[] } }
  | { type: 'REMOVE_PIECE'; payload: { nodeId: number; updatedNodes: NodeData[] } }
  | { type: 'SELECT_PIECE'; payload: { nodeId: number } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_MILL'; payload: { millNodes: readonly number[] } }
  | { type: 'CLEAR_MILL' }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'SET_GAME_PHASE'; payload: { phase: GamePhase } }
  | { type: 'SET_WINNER'; payload: { winner: Player } }
  | { type: 'SET_SKIP_MESSAGE'; payload: { message: string } }
  | { type: 'CLEAR_SKIP_MESSAGE' };

const initialGameState: GameState = {
  currentPlayer: 'P1',
  gamePhase: 'placing',
  p1Placed: 0,
  p2Placed: 0,
  selectedPiece: null,
  isMill: false,
  millNodes: [],
  winner: null,
  skipMessage: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLACE_PIECE':
      return {
        ...state,
        p1Placed: state.currentPlayer === 'P1' ? state.p1Placed + 1 : state.p1Placed,
        p2Placed: state.currentPlayer === 'P2' ? state.p2Placed + 1 : state.p2Placed,
      };

    case 'MOVE_PIECE':
    case 'REMOVE_PIECE':
      return state;

    case 'SELECT_PIECE':
      return {
        ...state,
        selectedPiece: action.payload.nodeId,
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedPiece: null,
      };

    case 'SET_MILL':
      return {
        ...state,
        isMill: true,
        millNodes: action.payload.millNodes,
      };

    case 'CLEAR_MILL':
      return {
        ...state,
        isMill: false,
        millNodes: [],
      };

    case 'SWITCH_PLAYER':
      return {
        ...state,
        currentPlayer: state.currentPlayer === 'P1' ? 'P2' : 'P1',
      };

    case 'SET_GAME_PHASE':
      return {
        ...state,
        gamePhase: action.payload.phase,
      };

    case 'SET_WINNER':
      return {
        ...state,
        winner: action.payload.winner,
      };

    case 'SET_SKIP_MESSAGE':
      return {
        ...state,
        skipMessage: action.payload.message,
      };

    case 'CLEAR_SKIP_MESSAGE':
      return {
        ...state,
        skipMessage: null,
      };

    default:
      return state;
  }
};

export const useGameState = (initialNodes: NodeData[]) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);

  // Auto-transition to moving phase
  useEffect(() => {
    if (canTransitionToMovingPhase(gameState.p1Placed, gameState.p2Placed) && 
        gameState.gamePhase === 'placing') {
      dispatch({ type: 'SET_GAME_PHASE', payload: { phase: 'moving' } });
    }
  }, [gameState.p1Placed, gameState.p2Placed, gameState.gamePhase]);

  // Check for win conditions
  useEffect(() => {
    if (gameState.gamePhase === 'moving' && !gameState.winner) {
      const winner = checkWinCondition(nodes);
      if (winner) {
        dispatch({ type: 'SET_WINNER', payload: { winner } });
      }
    }
  }, [nodes, gameState.gamePhase, gameState.winner]);

  // Auto-skip turn if no valid moves
  useEffect(() => {
    if (gameState.gamePhase === 'moving' && 
        !gameState.isMill && 
        !gameState.winner &&
        !hasValidMoves(nodes, gameState.currentPlayer)) {
      
      const message = `Player ${gameState.currentPlayer} has no valid moves, turn skipped!`;
      dispatch({ type: 'SET_SKIP_MESSAGE', payload: { message } });
      dispatch({ type: 'SWITCH_PLAYER' });
      dispatch({ type: 'CLEAR_SELECTION' });
      
      setTimeout(() => {
        dispatch({ type: 'CLEAR_SKIP_MESSAGE' });
      }, GAME_CONFIG.SKIP_MESSAGE_DURATION);
    }
  }, [gameState.gamePhase, gameState.currentPlayer, nodes, gameState.isMill, gameState.winner]);

  const handlePlacePiece = useCallback((nodeId: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || node.occupiedBy) return false;

    const currentPlayerPlaced = gameState.currentPlayer === 'P1' ? gameState.p1Placed : gameState.p2Placed;
    if (currentPlayerPlaced >= GAME_CONFIG.MAX_PIECES_PER_PLAYER) return false;

    const updatedNodes = nodes.map(n =>
      n.id === nodeId ? { ...n, occupiedBy: gameState.currentPlayer } : n
    );
    setNodes(updatedNodes);

    dispatch({ type: 'PLACE_PIECE', payload: { nodeId, updatedNodes } });

    const millResult = checkMillFormation(updatedNodes, nodeId, gameState.currentPlayer);
    if (millResult.isFormed && millResult.combination) {
      dispatch({ type: 'SET_MILL', payload: { millNodes: millResult.combination } });
    } else {
      dispatch({ type: 'SWITCH_PLAYER' });
      dispatch({ type: 'CLEAR_MILL' });
    }

    return true;
  }, [nodes, gameState.currentPlayer, gameState.p1Placed, gameState.p2Placed]);

  const handleMovePiece = useCallback((destinationId: number) => {
    if (gameState.selectedPiece === null) return false;

    const validation = validateMove(gameState.selectedPiece, destinationId, nodes);
    if (!validation.isValid) {
      dispatch({ type: 'CLEAR_SELECTION' });
      return false;
    }

    const updatedNodes = nodes.map(n => {
      if (n.id === gameState.selectedPiece) {
        return { ...n, occupiedBy: null };
      }
      if (n.id === destinationId) {
        return { ...n, occupiedBy: gameState.currentPlayer };
      }
      return n;
    });
    setNodes(updatedNodes);

    dispatch({ type: 'CLEAR_SELECTION' });

    const millResult = checkMillFormation(updatedNodes, destinationId, gameState.currentPlayer);
    if (millResult.isFormed && millResult.combination) {
      dispatch({ type: 'SET_MILL', payload: { millNodes: millResult.combination } });
    } else {
      dispatch({ type: 'SWITCH_PLAYER' });
      dispatch({ type: 'CLEAR_MILL' });
    }

    return true;
  }, [gameState.selectedPiece, gameState.currentPlayer, nodes]);

  const handleSelectPiece = useCallback((nodeId: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node?.occupiedBy === gameState.currentPlayer) {
      dispatch({ type: 'SELECT_PIECE', payload: { nodeId } });
      return true;
    }
    return false;
  }, [nodes, gameState.currentPlayer]);

  const handleRemovePiece = useCallback((nodeId: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || node.occupiedBy === gameState.currentPlayer || node.occupiedBy === null) {
      return false;
    }

    const updatedNodes = nodes.map(n =>
      n.id === nodeId ? { ...n, occupiedBy: null } : n
    );
    setNodes(updatedNodes);

    dispatch({ type: 'SWITCH_PLAYER' });
    dispatch({ type: 'CLEAR_MILL' });
    dispatch({ type: 'CLEAR_SELECTION' });

    return true;
  }, [nodes, gameState.currentPlayer]);

  return {
    gameState,
    nodes,
    actions: {
      handlePlacePiece,
      handleMovePiece,
      handleSelectPiece,
      handleRemovePiece,
    },
  };
};
