import { useEffect, useState } from 'react';
import { dividerPositions, linePositions, nodePositions } from '../nodeMap';
import { type NodeData, type Player } from '../types';
import './Board.css';



const millCombinations = [
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23],
];

const adjacencyMap: { [pos: number]: number[] } = {
  0: [1, 7],
  1: [0, 2, 9],
  2: [1, 3],
  3: [2, 4, 11],
  4: [3, 5],
  5: [4, 6, 13],
  6: [5, 7],
  7: [0, 6, 15],
  8: [9, 15],
  9: [1, 8, 10, 17],
  10: [9, 11],
  11: [3, 10, 12, 19],
  12: [11, 13],
  13: [5, 12, 14, 21],
  14: [13, 15],
  15: [7, 14, 8, 23],
  16: [17, 23],
  17: [9, 16, 18],
  18: [17, 19],
  19: [11, 18, 20],
  20: [19, 21],
  21: [13, 20, 22],
  22: [21, 23],
  23: [15, 22, 16],
};

export default function Board() {
  const [nodes, setNodes] = useState<NodeData[]>(nodePositions);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('P1');
  const [isMill, setIsMill] = useState(false);
  const [p1Placed, setP1Placed] = useState(0);
  const [p2Placed, setP2Placed] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'placing' | 'moving'>('placing');

  // Automatically transition to moving phase when all pieces are placed
  useEffect(() => {
    if (p1Placed === 9 && p2Placed === 9 && gamePhase === 'placing') {
      setGamePhase('moving');
    }
  }, [p1Placed, p2Placed, gamePhase]);

  const handlePlace = (id: number) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    // If a mill was formed, allow removing opponent's piece
    if (isMill) {
      if (node.occupiedBy === currentPlayer || node.occupiedBy === null) {
        console.warn('Cannot remove own piece or empty node');
        // Can't remove own piece or empty node
        return;
      }
      // Remove opponent's piece
      setNodes(nodes =>
        nodes.map(n =>
          n.id === id ? { ...n, occupiedBy: null } : n
        )
      );
      setCurrentPlayer(currentPlayer === 'P1' ? 'P2' : 'P1');
      setIsMill(false);
      setSelectedPiece(null);
      return;
    }

    // Handle moving phase
    if (gamePhase === 'moving') {
      if (selectedPiece === null) {
        // Select a piece to move
        if (node.occupiedBy === currentPlayer) {
          setSelectedPiece(id);
        }
        return;
      } else {
        // Move the selected piece
        if (node.occupiedBy !== null) {
          // Can't move to occupied position
          console.warn('Cannot move to occupied position');
          return;
        }
        
        // Check if destination is adjacent to selected piece
        if (!adjacencyMap[selectedPiece]?.includes(id)) {
          // Not adjacent, reset selection
          console.warn('Selected position is not adjacent to the selected piece', {id, selectedPiece, adjacencyMap: adjacencyMap[selectedPiece]});
          setSelectedPiece(null);
          return;
        }

        // Move the piece
        const updatedNodes = nodes.map(n => {
          if (n.id === selectedPiece) {
            return { ...n, occupiedBy: null };
          }
          if (n.id === id) {
            return { ...n, occupiedBy: currentPlayer };
          }
          return n;
        });
        setNodes(updatedNodes);
        setSelectedPiece(null);

        // Check for mill formation
        const formedMill = millCombinations.some(comb =>
          comb.includes(id) && comb.every(pos => updatedNodes[pos].occupiedBy === currentPlayer)
        );

        if (formedMill) {
          setIsMill(true);
        } else {
          setCurrentPlayer(currentPlayer === 'P1' ? 'P2' : 'P1');
          setIsMill(false);
        }
        return;
      }
    }

    // Handle placing phase
    if (gamePhase === 'placing') {
      // Can't place on occupied node
      if (node.occupiedBy) return;

      // Limit pieces placed per player
      if ((currentPlayer === 'P1' && p1Placed >= 9) || (currentPlayer === 'P2' && p2Placed >= 9)) return;

      // Place piece
      const updatedNodes = nodes.map(n =>
        n.id === id ? { ...n, occupiedBy: currentPlayer } : n
      );
      setNodes(updatedNodes);

      if (currentPlayer === 'P1') setP1Placed(p1Placed + 1);
      else setP2Placed(p2Placed + 1);

      // Check for mill formation
      const formedMill = millCombinations.some(comb =>
        comb.includes(id) && comb.every(pos => updatedNodes[pos].occupiedBy === currentPlayer)
      );

      if (formedMill) {
        setIsMill(true);
      } else {
        setCurrentPlayer(currentPlayer === 'P1' ? 'P2' : 'P1');
        setIsMill(false);
      }
    }
  };



  return (
    <div>
      <div className="game-status">
        <p>Current Player: {currentPlayer}</p>
        <p>Game Phase: {gamePhase === 'placing' ? 'Placing Pieces' : 'Moving Pieces'}</p>
        <p>P1 Placed: {p1Placed}/9 | P2 Placed: {p2Placed}/9</p>
        {isMill && <p>Mill formed! Remove opponent's piece.</p>}
        {gamePhase === 'moving' && selectedPiece !== null && (
          <p>Selected piece at position {selectedPiece}. Click an adjacent empty position to move.</p>
        )}
      </div>
      <svg viewBox="0 0 100 100" className="board">
        {linePositions.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="diagonal"
          />
        ))}
        {dividerPositions.map((divider, index) => (
          <line
            key={`divider-${index}`}
            x1={divider.x1}
            y1={divider.y1}
            x2={divider.x2}
            y2={divider.y2}
            className="diagonal"
          />
        ))}
        {nodes.map(node => (
          <g key={node.id} onClick={() => handlePlace(node.id)}>
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={3}
            className={`node ${node.occupiedBy?.toLowerCase()} ${
              selectedPiece === node.id ? 'selected' : ''
            }`}
           
            />
            <text x={node.x} y={node.y} className="node-label">
            {node.id}
            </text>
      
            </g>
        ))}
      </svg>
    </div>
  );
}
