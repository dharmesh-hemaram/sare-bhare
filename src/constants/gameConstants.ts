// Mill combinations for Nine Men's Morris game
export const MILL_COMBINATIONS: readonly number[][] = [
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23],
] as const;

// Adjacency map for valid piece movements
export const ADJACENCY_MAP: Readonly<Record<number, readonly number[]>> = {
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
} as const;

// Game configuration constants
export const GAME_CONFIG = {
  MAX_PIECES_PER_PLAYER: 9,
  MIN_PIECES_TO_LOSE: 2,
  SKIP_MESSAGE_DURATION: 3000,
} as const;
