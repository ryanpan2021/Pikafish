import { create } from 'zustand';
import { 
  GameState, 
  Piece, 
  Position, 
  Move, 
  PieceColor,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '../types/chess';
import { 
  createInitialBoard, 
  getValidMoves, 
  makeMove, 
  copyBoard,
  boardToFEN,
  uciToMove
} from '../utils/chessLogic';

interface GameStore extends GameState {
  setGameMode: (mode: 'pvp' | 'pve' | 'setup') => void;
  setAiColor: (color: PieceColor) => void;
  selectPiece: (piece: Piece | null) => void;
  movePiece: (to: Position) => void;
  undoMove: () => void;
  resetGame: () => void;
  requestAiMove: () => Promise<void>;
  requestAiSuggestion: () => Promise<void>;
  placePiece: (piece: Piece, pos: Position) => void;
  removePiece: (pos: Position) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: createInitialBoard(),
  currentTurn: 'red',
  history: [],
  gameMode: 'pvp',
  isGameOver: false,
  winner: undefined,
  selectedPiece: null,
  validMoves: [],
  aiThinking: false,
  suggestedMove: null,
  aiColor: 'black',

  setGameMode: (mode) => set({ gameMode: mode }),
  setAiColor: (color) => set({ aiColor: color }),

  selectPiece: (piece) => {
    const { board, currentTurn } = get();
    if (piece) {
      if (piece.color === currentTurn) {
        const validMoves = getValidMoves(board, piece);
        set({ selectedPiece: piece, validMoves, suggestedMove: null });
      }
    } else {
      set({ selectedPiece: null, validMoves: [], suggestedMove: null });
    }
  },

  movePiece: (to) => {
    const { board, selectedPiece, history, currentTurn } = get();
    if (!selectedPiece) return;

    const from = selectedPiece.position;
    const validMoves = getValidMoves(board, selectedPiece);
    
    const isValid = validMoves.some(m => m.x === to.x && m.y === to.y);
    if (!isValid) return;

    const move: Move = { 
      from, 
      to, 
      piece: selectedPiece, 
      captured: board[to.y][to.x] 
    };
    const newBoard = makeMove(board, move);

    const newTurn = currentTurn === 'red' ? 'black' : 'red';

    set({
      board: newBoard,
      currentTurn: newTurn,
      history: [...history, move],
      selectedPiece: null,
      validMoves: [],
      suggestedMove: null
    });
  },

  undoMove: () => {
    const { board, history } = get();
    if (history.length === 0) return;

    const lastMove = history[history.length - 1];
    const newBoard = copyBoard(board);
    
    // 还原棋子
    const piece = { ...lastMove.piece, position: lastMove.from };
    newBoard[lastMove.from.y][lastMove.from.x] = piece;
    newBoard[lastMove.to.y][lastMove.to.x] = lastMove.captured;

    set({
      board: newBoard,
      history: history.slice(0, -1),
      currentTurn: history.length % 2 === 0 ? 'red' : 'black',
      selectedPiece: null,
      validMoves: [],
      suggestedMove: null
    });
  },

  resetGame: () => set({
    board: createInitialBoard(),
    currentTurn: 'red',
    history: [],
    isGameOver: false,
    winner: undefined,
    selectedPiece: null,
    validMoves: [],
    suggestedMove: null,
    aiThinking: false
  }),

  requestAiMove: async () => {
    const { board, currentTurn } = get();
    set({ aiThinking: true });
    
    try {
      const fen = boardToFEN(board, currentTurn);
      const response = await fetch('/api/engine/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.move) {
          const { from, to } = uciToMove(data.move);
          const piece = board[from.y][from.x];
          
          if (piece) {
            const move: Move = { from, to, piece, captured: board[to.y][to.x] };
            const newBoard = makeMove(board, move);
            
            set(state => ({
              board: newBoard,
              currentTurn: state.currentTurn === 'red' ? 'black' : 'red',
              history: [...state.history, move],
              selectedPiece: null,
              validMoves: [],
              suggestedMove: null,
              aiThinking: false
            }));
          }
        }
      }
    } catch (error) {
      console.error('AI move request failed:', error);
    } finally {
      set({ aiThinking: false });
    }
  },

  requestAiSuggestion: async () => {
    const { board, currentTurn } = get();
    set({ aiThinking: true });
    
    try {
      const fen = boardToFEN(board, currentTurn);
      const response = await fetch('/api/engine/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.move) {
          const { from, to } = uciToMove(data.move);
          const piece = board[from.y][from.x];
          
          if (piece) {
            const suggestedMove: Move = { from, to, piece, captured: board[to.y][to.x] };
            set({ suggestedMove, aiThinking: false });
          }
        }
      }
    } catch (error) {
      console.error('AI suggestion request failed:', error);
    } finally {
      set({ aiThinking: false });
    }
  },

  placePiece: (piece, pos) => {
    const { board } = get();
    const newBoard = copyBoard(board);
    newBoard[pos.y][pos.x] = { ...piece, position: pos };
    set({ board: newBoard });
  },

  removePiece: (pos) => {
    const { board } = get();
    const newBoard = copyBoard(board);
    newBoard[pos.y][pos.x] = null;
    set({ board: newBoard });
  }
}));
