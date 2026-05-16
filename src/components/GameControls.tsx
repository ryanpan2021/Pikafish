import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, Undo2, Brain, Trophy, Users, MonitorPlay, Settings2 } from 'lucide-react';

const GameControls: React.FC = () => {
  const { 
    gameMode, 
    setGameMode, 
    resetGame, 
    undoMove, 
    requestAiSuggestion,
    requestAiMove,
    aiThinking,
    currentTurn,
    history,
    aiColor,
    setAiColor
  } = useGameStore();

  return (
    <div className="w-full max-w-md space-y-4">
      {/* 游戏状态 */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold text-amber-800 mb-2 flex items-center gap-2">
          <Trophy size={20} />
          中国象棋
        </h2>
        <div className="flex justify-between text-sm">
          <span>当前回合: </span>
          <span className={`font-bold ${currentTurn === 'red' ? 'text-red-600' : 'text-amber-800'}`}>
            {currentTurn === 'red' ? '红方' : '黑方'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          走法数: {history.length}
        </div>
      </div>

      {/* 游戏模式选择 */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Settings2 size={16} />
          游戏模式
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setGameMode('pvp')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              gameMode === 'pvp' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users size={18} />
            <span className="text-xs">双人对战</span>
          </button>
          <button
            onClick={() => setGameMode('pve')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              gameMode === 'pve' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MonitorPlay size={18} />
            <span className="text-xs">人机对战</span>
          </button>
          <button
            onClick={() => setGameMode('setup')}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
              gameMode === 'setup' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings2 size={18} />
            <span className="text-xs">摆棋模式</span>
          </button>
        </div>

        {gameMode === 'pve' && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">AI执子</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setAiColor('red')}
                className={`flex-1 py-1 rounded text-sm transition-all ${
                  aiColor === 'red' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                红方
              </button>
              <button
                onClick={() => setAiColor('black')}
                className={`flex-1 py-1 rounded text-sm transition-all ${
                  aiColor === 'black' ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                黑方
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">操作</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={resetGame}
            className="p-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg shadow-md hover:from-red-500 hover:to-red-600 transition-all flex flex-col items-center gap-1"
          >
            <RotateCcw size={20} />
            <span className="text-xs">重置</span>
          </button>

          <button
            onClick={undoMove}
            disabled={history.length === 0}
            className="p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg shadow-md hover:from-gray-500 hover:to-gray-600 transition-all flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 size={20} />
            <span className="text-xs">悔棋</span>
          </button>

          <button
            onClick={requestAiSuggestion}
            disabled={aiThinking}
            className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition-all flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain size={20} />
            <span className="text-xs">AI 建议</span>
          </button>
        </div>

        {gameMode === 'pve' && (
          <button
            onClick={requestAiMove}
            disabled={aiThinking}
            className="w-full mt-3 p-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg shadow-md hover:from-purple-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiThinking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI 思考中...
              </>
            ) : (
              <>
                <MonitorPlay size={18} />
                让 AI 走一步
              </>
            )}
          </button>
        )}
      </div>

      {/* 走法历史 */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-md max-h-40 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">走法历史</h3>
          <div className="text-xs font-mono space-y-1">
            {history.map((move, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-400 w-6">{index + 1}.</span>
                <span className={move.piece.color === 'red' ? 'text-red-600' : 'text-amber-800'}>
                  {move.piece.color === 'red' ? '红' : '黑'}
                </span>
                <span className="text-gray-600">
                  ({move.from.x},{move.from.y})→({move.to.x},{move.to.y})
                </span>
                {move.captured && <span className="text-red-500">吃</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
