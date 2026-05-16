// 棋子类型
export type PieceType = 'general' | 'advisor' | 'elephant' | 'horse' | 'chariot' | 'cannon' | 'soldier';
export type PieceColor = 'red' | 'black';

// 棋子
export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;
}

// 位置
export interface Position {
  x: number; // 0-8
  y: number; // 0-9
}

// 走法
export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
}

// 游戏状态
export interface GameState {
  board: (Piece | null)[][];
  currentTurn: PieceColor;
  history: Move[];
  gameMode: 'pvp' | 'pve' | 'setup';
  isGameOver: boolean;
  winner?: PieceColor;
  selectedPiece: Piece | null;
  validMoves: Position[];
  aiThinking: boolean;
  suggestedMove: Move | null;
  aiColor: PieceColor;
}

// AI 请求
export interface AiRequest {
  fen: string;
  depth?: number;
  time?: number;
}

// AI 响应
export interface AiResponse {
  move: string;
  evaluation?: number;
  depth?: number;
}

// 棋子汉字映射
export const pieceNames: Record<PieceType, string> = {
  general: '将',
  advisor: '士',
  elephant: '象',
  horse: '马',
  chariot: '车',
  cannon: '炮',
  soldier: '卒',
};

// 红方棋子汉字
export const redPieceNames: Record<PieceType, string> = {
  general: '帅',
  advisor: '仕',
  elephant: '相',
  horse: '馬',
  chariot: '車',
  cannon: '炮',
  soldier: '兵',
};

// 棋盘尺寸
export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 10;
