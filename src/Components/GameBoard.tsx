import React from 'react';
import type { NodeData } from '../types';

interface LinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface GameBoardProps {
  nodes: readonly NodeData[];
  linePositions: readonly LinePosition[];
  dividerPositions: readonly LinePosition[];
  millNodes: readonly number[];
  selectedPiece: number | null;
  onNodeClick: (nodeId: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  nodes,
  linePositions,
  dividerPositions,
  millNodes,
  selectedPiece,
  onNodeClick,
}) => {
  return (
    <svg viewBox="0 0 100 100" className="board">
      {/* Render board lines */}
      {linePositions.map(line => (
        <line
          key={`line-${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          className="diagonal"
        />
      ))}
      
      {/* Render board dividers */}
      {dividerPositions.map(divider => (
        <line
          key={`divider-${divider.x1}-${divider.y1}-${divider.x2}-${divider.y2}`}
          x1={divider.x1}
          y1={divider.y1}
          x2={divider.x2}
          y2={divider.y2}
          className="diagonal"
        />
      ))}
      
      {/* Render board nodes */}
      {nodes.map(node => {
        const nodeClasses = [
          'node',
          millNodes.includes(node.id) && 'mill-highlight',
        ].filter(Boolean).join(' ');

        return (
          <g key={`node-${node.id}`} onClick={() => onNodeClick(node.id)}>
            <circle
              cx={node.x}
              cy={node.y}
              r={3}
              className={nodeClasses}
            />
          </g>
        );
      })}
      
      {/* Render player pieces */}
      {nodes.map(node => {
        if (!node.occupiedBy) return null;

        const pieceClasses = [
          'player-piece',
          node.occupiedBy.toLowerCase(),
          selectedPiece === node.id && 'selected',
        ].filter(Boolean).join(' ');

        return (
          <g key={`piece-${node.id}`} onClick={() => onNodeClick(node.id)}>
            <circle
              cx={node.x}
              cy={node.y}
              r={2.5}
              className={pieceClasses}
            />
          </g>
        );
      })}
    </svg>
  );
};
