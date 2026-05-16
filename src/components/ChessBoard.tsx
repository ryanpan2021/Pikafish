import React from 'react';
import { Piece, Position, BOARD_WIDTH, BOARD_HEIGHT, pieceNames, redPieceNames } from '../types/chess';
import { useGameStore } from '../store/gameStore';

interface ChessBoardProps {
  className?: string;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ className = '' }) => {
  const { 
    board, 
    selectedPiece, 
    validMoves, 
    suggestedMove,
    selectPiece, 
    movePiece,
    gameMode,
    currentTurn,
    aiThinking
  } = useGameStore();

  const cellSize = Math.min(
    (window.innerWidth - 40) / BOARD_WIDTH,
    50
  );

  const isValidMovePosition = (pos: Position) => {
    return validMoves.some(m => m.x === pos.x && m.y === pos.y);
  };

  const handleCellClick = (x: number, y: number) => {
    if (aiThinking) return;

    const piece = board[y][x];
    const pos = { x, y };

    if (selectedPiece) {
      if (isValidMovePosition(pos)) {
        movePiece(pos);
      } else if (piece && piece.color === currentTurn) {
        selectPiece(piece);
      } else {
        selectPiece(null);
      }
    } else {
      if (piece && piece.color === currentTurn) {
        selectPiece(piece);
      }
    }
  };

  const renderPiece = (piece: Piece, x: number, y: number) => {
    const isSelected = selectedPiece?.position.x === x && selectedPiece?.position.y === y;
    const name = piece.color === 'red' ? redPieceNames[piece.type] : pieceNames[piece.type];
    
    return (
      <div
        key={`${x}-${y}`}
        className={`absolute flex items-center justify-center rounded-full transition-transform cursor-pointer select-none border-2 shadow-md hover:scale-105 ${
          piece.color === 'red' ? 'bg-red-100 text-red-800 border-red-400' : 'bg-amber-50 text-amber-800 border-amber-700'
        } ${
          isSelected ? 'ring-4 ring-yellow-400 scale-110 z-10' : ''
        } ${
          suggestedMove && (
            (suggestedMove.from.x === x && suggestedMove.from.y === y) ||
            (suggestedMove.to.x === x && suggestedMove.to.y === y)
          ) ? 'ring-2 ring-blue-400' : ''
        }`}
        style={{
          width: cellSize * 0.85,
          height: cellSize * 0.85,
          left: x * cellSize + cellSize * 0.075,
          top: y * cellSize + cellSize * 0.075,
          fontFamily: '"KaiTi", "STKaiti", serif',
          fontSize: cellSize * 0.5,
          fontWeight: 'bold'
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleCellClick(x, y);
        }}
      >
        {name}
      </div>
    );
  };

  return (
    <div 
      className={`relative bg-amber-100 rounded-lg shadow-2xl p-4 ${className}`}
      style={{
        width: cellSize * BOARD_WIDTH + 32,
        height: cellSize * BOARD_HEIGHT + 32
      }}
    >
      <div 
        className="relative bg-gradient-to-br from-amber-700 to-amber-900 rounded p-3"
        style={{
          width: cellSize * BOARD_WIDTH,
          height: cellSize * BOARD_HEIGHT
        }}
      >
        {/* 棋盘网格 */}
        <svg 
          className="absolute inset-0"
          style={{ width: cellSize * BOARD_WIDTH, height: cellSize * BOARD_HEIGHT }}
        >
          {/* 横线 */}
          {Array.from({ length: BOARD_HEIGHT }).map((_, y) => (
            <line
              key={`h-${y}`}
              x1={cellSize / 2}
              y1={y * cellSize + cellSize / 2}
              x2={(BOARD_WIDTH - 0.5) * cellSize}
              y2={y * cellSize + cellSize / 2}
              stroke="#1a1a1a"
              strokeWidth="2"
            />
          ))}
          
          {/* 竖线 */}
          {Array.from({ length: BOARD_WIDTH }).map((_, x) => (
            <React.Fragment key={`v-${x}`}>
              <line
                x1={x * cellSize + cellSize / 2}
                y1={cellSize / 2}
                x2={x * cellSize + cellSize / 2}
                y2={4 * cellSize + cellSize / 2}
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              <line
                x1={x * cellSize + cellSize / 2}
                y1={5 * cellSize + cellSize / 2}
                x2={x * cellSize + cellSize / 2}
                y2={(BOARD_HEIGHT - 0.5) * cellSize}
                stroke="#1a1a1a"
                strokeWidth="2"
              />
            </React.Fragment>
          ))}

          {/* 九宫格斜线 */}
          <line x1={3 * cellSize + cellSize / 2} y1={cellSize / 2} x2={5 * cellSize + cellSize / 2} y2={2 * cellSize + cellSize / 2} stroke="#1a1a1a" strokeWidth="2" />
          <line x1={5 * cellSize + cellSize / 2} y1={cellSize / 2} x2={3 * cellSize + cellSize / 2} y2={2 * cellSize + cellSize / 2} stroke="#1a1a1a" strokeWidth="2" />
          <line x1={3 * cellSize + cellSize / 2} y1={7 * cellSize + cellSize / 2} x2={5 * cellSize + cellSize / 2} y2={9 * cellSize + cellSize / 2} stroke="#1a1a1a" strokeWidth="2" />
          <line x1={5 * cellSize + cellSize / 2} y1={7 * cellSize + cellSize / 2} x2={3 * cellSize + cellSize / 2} y2={9 * cellSize + cellSize / 2} stroke="#1a1a1a" strokeWidth="2" />
          
          {/* 炮和兵的位置标记 */}
          {[0, 2, 4, 6, 8].map(x => [3, 6].map(y => (
            <circle key={`marker-${x}-${y}`} cx={x * cellSize + cellSize / 2} cy={y * cellSize + cellSize / 2} r="3" fill="#1a1a1a" />
          )))}
          {[1, 7].map(x => [2, 7].map(y => (
            <circle key={`marker-${x}-${y}`} cx={x * cellSize + cellSize / 2} cy={y * cellSize + cellSize / 2} r="3" fill="#1a1a1a" />
          )))}
        </svg>

        {/* 楚河汉界 */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{
            top: 4.5 * cellSize,
            height: cellSize,
            fontFamily: '"KaiTi", "STKaiti", serif',
            fontSize: cellSize * 0.5,
            color: '#4a2c2a'
          }}
        >
          <span className="px-4">楚河</span>
          <span className="px-8"></span>
          <span className="px-4">汉界</span>
        </div>

        {/* 有效走法标记 */}
        {validMoves.map((pos) => (
          <div
            key={`valid-${pos.x}-${pos.y}`}
            className="absolute rounded-full bg-green-400/50 cursor-pointer"
            style={{
              width: cellSize * 0.3,
              height: cellSize * 0.3,
              left: pos.x * cellSize + cellSize * 0.35,
              top: pos.y * cellSize + cellSize * 0.35
            }}
            onClick={() => handleCellClick(pos.x, pos.y)}
          />
        ))}

        {/* 建议走法标记 */}
        {suggestedMove && (
          <>
            <div
              className="absolute border-4 border-blue-500 animate-pulse rounded-full"
              style={{
                width: cellSize * 0.9,
                height: cellSize * 0.9,
                left: suggestedMove.to.x * cellSize + cellSize * 0.05,
                top: suggestedMove.to.y * cellSize + cellSize * 0.05
              }}
            />
            <div
              className="absolute bg-blue-400/70 rounded-full"
              style={{
                width: cellSize * 0.3,
                height: cellSize * 0.3,
                left: suggestedMove.to.x * cellSize + cellSize * 0.35,
                top: suggestedMove.to.y * cellSize + cellSize * 0.35
              }}
            />
          </>
        )}

        {/* 棋子 */}
        {board.map((row, y) =>
          row.map((piece, x) =>
            piece && renderPiece(piece, x, y)
          )
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
