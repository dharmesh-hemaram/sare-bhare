import { type NodeData } from './types/NodeData';

// 24 nodes (x, y in percentage for responsive SVG)
export const nodePositions: NodeData[] = [
  { id: 0, x: 5, y: 5, occupiedBy: null },
  { id: 1, x: 50, y: 5, occupiedBy: null },
  { id: 2, x: 95, y: 5, occupiedBy: null },
  { id: 3, x: 95, y: 50, occupiedBy: null },
  { id: 4, x: 95, y: 95, occupiedBy: null },
  { id: 5, x: 50, y: 95, occupiedBy: null },
  { id: 6, x: 5, y: 95, occupiedBy: null },
  { id: 7, x: 5, y: 50, occupiedBy: null },

  { id: 8, x: 20, y: 20, occupiedBy: null },
  { id: 9, x: 50, y: 20, occupiedBy: null },
  { id: 10, x: 80, y: 20, occupiedBy: null },
  { id: 11, x: 80, y: 50, occupiedBy: null },
  { id: 12, x: 80, y: 80, occupiedBy: null },
  { id: 13, x: 50, y: 80, occupiedBy: null },
  { id: 14, x: 20, y: 80, occupiedBy: null },
  { id: 15, x: 20, y: 50, occupiedBy: null },

  { id: 16, x: 35, y: 35, occupiedBy: null },
  { id: 17, x: 50, y: 35, occupiedBy: null },
  { id: 18, x: 65, y: 35, occupiedBy: null },
  { id: 19, x: 65, y: 50, occupiedBy: null },
  { id: 20, x: 65, y: 65, occupiedBy: null },
  { id: 21, x: 50, y: 65, occupiedBy: null },
  { id: 22, x: 35, y: 65, occupiedBy: null },
  { id: 23, x: 35, y: 50, occupiedBy: null },
];


export const linePositions = [
    { x1: 5, y1: 5, x2: 95, y2: 5 },
    { x1: 5, y1: 5, x2: 5, y2: 95 },
    { x1: 5, y1: 95, x2: 95, y2: 95 },
    { x1: 95, y1: 5, x2: 95, y2: 95 },
    { x1: 20, y1: 20, x2: 80, y2: 20 },
    { x1: 20, y1: 20, x2: 20, y2: 80 },
    { x1: 20, y1: 80, x2: 80, y2: 80 },
    { x1: 80, y1: 20, x2: 80, y2: 80 },
    { x1: 35, y1: 35, x2: 65, y2: 35 },
    { x1: 35, y1: 35, x2: 35, y2: 65 },
    { x1: 35, y1: 65, x2: 65, y2: 65 },
    { x1: 65, y1: 35, x2: 65, y2: 65 },
];

export const dividerPositions = [
    { x1: 5, y1: 50, x2: 35, y2: 50 },
    { x1: 65, y1: 50, x2: 95, y2: 50 },
    { x1: 50, y1: 5, x2: 50, y2: 35 },
    { x1: 50, y1: 65, x2: 50, y2: 95 },

]


