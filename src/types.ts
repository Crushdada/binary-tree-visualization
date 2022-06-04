export interface BlockState {
  x: number;
  y: number;
  revealed?: boolean; // 是否已翻开
  mine?: boolean; // 是否有炸弹
  flagged?: boolean; // 是否已标记
  adjacentMines: number; // 周围炸弹数
}