import type { Player } from "./Player";

export interface NodeData {
  id: number;
  x: number;
  y: number;
  occupiedBy: Player | null;
}