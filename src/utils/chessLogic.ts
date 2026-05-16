import { 
  Piece, 
  PieceType, 
  PieceColor, 
  Position, 
  Move, 
  BOARD_WIDTH, 
  BOARD_HEIGHT
} from '../types/chess';

// 创建初始棋盘
export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null)
  );

  // 黑方 (上方, y=0-4)
  const blackPieces: [number, PieceType][] = [
    [0, 'chariot'], [1, 'horse'], [2, 'elephant'], [3, 'advisor'], [4, 'general'],
    [5, 'advisor'], [6, 'elephant'], [7, 'horse'], [8, 'chariot'],
  ];
  blackPieces.forEach(([x, type]) => {
    board[0][x] = { type, color: 'black', position: { x, y: 0 } };
  });
  
  board[2][1] = { type: 'cannon', color: 'black', position: { x: 1, y: 2 } };
  board[2][7] = { type: 'cannon', color: 'black', position: { x: 7, y: 2 } };
  
  [0, 2, 4, 6, 8].forEach(x => {
    board[3][x] = { type: 'soldier', color: 'black', position: { x, y: 3 } };
  });

  // 红方 (下方, y=5-9)
  [0, 2, 4, 6, 8].forEach(x => {
    board[6][x] = { type: 'soldier', color: 'red', position: { x, y: 6 } };
  });
  
  board[7][1] = { type: 'cannon', color: 'red', position: { x: 1, y: 7 } };
  board[7][7] = { type: 'cannon', color: 'red', position: { x: 7, y: 7 } };
  
  const redPieces: [number, PieceType][] = [
    [0, 'chariot'], [1, 'horse'], [2, 'elephant'], [3, 'advisor'], [4, 'general'],
    [5, 'advisor'], [6, 'elephant'], [7, 'horse'], [8, 'chariot'],
  ];
  redPieces.forEach(([x, type]) => {
    board[9][x] = { type, color: 'red', position: { x, y: 9 } };
  });

  return board;
}

// 深度复制棋盘
export function copyBoard(board: (Piece | null)[][]): (Piece | null)[][] {
  return board.map(row => 
    row.map(piece => 
      piece ? { ...piece, position: { ...piece.position } } : null
    )
  );
}

// 检查位置是否在棋盘内
export function isValidPosition(pos: Position): boolean {
  return pos.x >= 0 && pos.x < BOARD_WIDTH && pos.y >= 0 && pos.y < BOARD_HEIGHT;
}

// 检查位置是否在九宫格内
export function isInPalace(pos: Position, color: PieceColor): boolean {
  if (pos.x < 3 || pos.x > 5) return false;
  if (color === 'black') {
    return pos.y >= 0 && pos.y <= 2;
  } else {
    return pos.y >= 7 && pos.y <= 9;
  }
}

// 检查棋子的所有合法走法
export function getValidMoves(
  board: (Piece | null)[][],
  piece: Piece
): Position[] {
  const moves: Position[] = [];
  const { type, color, position } = piece;

  switch (type) {
    case 'general':
      getGeneralMoves(board, piece, moves);
      break;
    case 'advisor':
      getAdvisorMoves(board, piece, moves);
      break;
    case 'elephant':
      getElephantMoves(board, piece, moves);
      break;
    case 'horse':
      getHorseMoves(board, piece, moves);
      break;
    case 'chariot':
      getChariotMoves(board, piece, moves);
      break;
    case 'cannon':
      getCannonMoves(board, piece, moves);
      break;
    case 'soldier':
      getSoldierMoves(board, piece, moves);
      break;
  }

  return moves;
}

// 将/帅的合法走法
function getGeneralMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { color, position } = piece;
  const { x, y } = position;
  
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  
  directions.forEach(({ dx, dy }) => {
    const newPos = { x: x + dx, y: y + dy };
    if (isInPalace(newPos, color) && isValidPosition(newPos)) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  });
}

// 士的合法走法
function getAdvisorMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { color, position } = piece;
  const { x, y } = position;
  
  const directions = [
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];
  
  directions.forEach(({ dx, dy }) => {
    const newPos = { x: x + dx, y: y + dy };
    if (isInPalace(newPos, color) && isValidPosition(newPos)) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  });
}

// 象的合法走法
function getElephantMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { color, position } = piece;
  const { x, y } = position;
  
  const directions = [
    { dx: -2, dy: -2, blockX: -1, blockY: -1 },
    { dx: 2, dy: -2, blockX: 1, blockY: -1 },
    { dx: -2, dy: 2, blockX: -1, blockY: 1 },
    { dx: 2, dy: 2, blockX: 1, blockY: 1 },
  ];
  
  const minY = color === 'black' ? 0 : 5;
  const maxY = color === 'black' ? 4 : 9;
  
  directions.forEach(({ dx, dy, blockX, blockY }) => {
    const newPos = { x: x + dx, y: y + dy };
    const blockPos = { x: x + blockX, y: y + blockY };
    
    if (
      isValidPosition(newPos) &&
      newPos.y >= minY && newPos.y <= maxY &&
      !board[blockPos.y][blockPos.x]
    ) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  });
}

// 马的合法走法
function getHorseMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { position } = piece;
  const { x, y } = position;
  
  const horseMoves = [
    { dx: -1, dy: -2, blockX: 0, blockY: -1 },
    { dx: 1, dy: -2, blockX: 0, blockY: -1 },
    { dx: -1, dy: 2, blockX: 0, blockY: 1 },
    { dx: 1, dy: 2, blockX: 0, blockY: 1 },
    { dx: -2, dy: -1, blockX: -1, blockY: 0 },
    { dx: -2, dy: 1, blockX: -1, blockY: 0 },
    { dx: 2, dy: -1, blockX: 1, blockY: 0 },
    { dx: 2, dy: 1, blockX: 1, blockY: 0 },
  ];
  
  horseMoves.forEach(({ dx, dy, blockX, blockY }) => {
    const newPos = { x: x + dx, y: y + dy };
    const blockPos = { x: x + blockX, y: y + blockY };
    
    if (isValidPosition(newPos) && !board[blockPos.y][blockPos.x]) {
      const targetPiece = board[newPos.y][newPos.x];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  });
}

// 车的合法走法
function getChariotMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { position } = piece;
  const { x, y } = position;
  
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  
  directions.forEach(({ dx, dy }) => {
    let nx = x + dx;
    let ny = y + dy;
    
    while (isValidPosition({ x: nx, y: ny })) {
      const targetPiece = board[ny][nx];
      if (!targetPiece) {
        moves.push({ x: nx, y: ny });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ x: nx, y: ny });
        }
        break;
      }
      nx += dx;
      ny += dy;
    }
  });
}

// 炮的合法走法
function getCannonMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { position } = piece;
  const { x, y } = position;
  
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
  ];
  
  directions.forEach(({ dx, dy }) => {
    let nx = x + dx;
    let ny = y + dy;
    let jumped = false;
    
    while (isValidPosition({ x: nx, y: ny })) {
      const targetPiece = board[ny][nx];
      
      if (!jumped) {
        if (!targetPiece) {
          moves.push({ x: nx, y: ny });
        } else {
          jumped = true;
        }
      } else {
        if (targetPiece) {
          if (targetPiece.color !== piece.color) {
            moves.push({ x: nx, y: ny });
          }
          break;
        }
      }
      nx += dx;
      ny += dy;
    }
  });
}

// 卒/兵的合法走法
function getSoldierMoves(
  board: (Piece | null)[][],
  piece: Piece,
  moves: Position[]
) {
  const { color, position } = piece;
  const { x, y } = position;
  
  const forward = color === 'black' ? 1 : -1;
  const newPos = { x, y: y + forward };
  
  if (isValidPosition(newPos)) {
    const targetPiece = board[newPos.y][newPos.x];
    if (!targetPiece || targetPiece.color !== color) {
      moves.push(newPos);
    }
  }
  
  const crossedRiver = color === 'black' ? y >= 5 : y <= 4;
  if (crossedRiver) {
    [{ x: x - 1, y }, { x: x + 1, y }].forEach(pos => {
      if (isValidPosition(pos)) {
        const targetPiece = board[pos.y][pos.x];
        if (!targetPiece || targetPiece.color !== color) {
          moves.push(pos);
        }
      }
    });
  }
}

// 执行走法
export function makeMove(
  board: (Piece | null)[][],
  move: Move
): (Piece | null)[][] {
  const newBoard = copyBoard(board);
  const { from, to, piece } = move;
  
  const captured = newBoard[to.y][to.x];
  
  const newPiece = { ...piece, position: to };
  newBoard[to.y][to.x] = newPiece;
  newBoard[from.y][from.x] = null;
  
  return newBoard;
}

// FEN 转换（简化版中国象棋 FEN）
export function boardToFEN(
  board: (Piece | null)[][],
  currentTurn: PieceColor
): string {
  let fen = '';
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    let emptyCount = 0;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const piece = board[y][x];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        let char = getFENChar(piece);
        fen += char;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    if (y < BOARD_HEIGHT - 1) {
      fen += '/';
    }
  }
  
  fen += ' ' + (currentTurn === 'red' ? 'w' : 'b');
  return fen;
}

function getFENChar(piece: Piece): string {
  const pieceMap: Record<string, string> = {
    'red-general': 'K',
    'red-advisor': 'A',
    'red-elephant': 'B',
    'red-horse': 'N',
    'red-chariot': 'R',
    'red-cannon': 'C',
    'red-soldier': 'P',
    'black-general': 'k',
    'black-advisor': 'a',
    'black-elephant': 'b',
    'black-horse': 'n',
    'black-chariot': 'r',
    'black-cannon': 'c',
    'black-soldier': 'p',
  };
  return pieceMap[`${piece.color}-${piece.type}`] || ' ';
}

// UCI 格式转坐标
export function uciToMove(uci: string): { from: Position; to: Position } {
  const files = 'abcdefghi';
  const fromFile = uci[0];
  const fromRank = parseInt(uci[1]);
  const toFile = uci[2];
  const toRank = parseInt(uci[3]);
  
  return {
    from: { x: files.indexOf(fromFile), y: 9 - (fromRank - 1) },
    to: { x: files.indexOf(toFile), y: 9 - (toRank - 1) },
  };
}

// 坐标转 UCI
export function moveToUCI(from: Position, to: Position): string {
  const files = 'abcdefghi';
  return `${files[from.x]}${9 - from.y + 1}${files[to.x]}${9 - to.y + 1}`;
}
