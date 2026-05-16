import React from 'react';
import ChessBoard from '../components/ChessBoard';
import GameControls from '../components/GameControls';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2" style={{ fontFamily: '"KaiTi", "STKaiti", serif' }}>
            中国象棋
          </h1>
          <p className="text-amber-600">人机大战 - 智慧对决</p>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* 棋盘 */}
          <div className="flex-shrink-0">
            <ChessBoard />
          </div>

          {/* 控制面板 */}
          <div className="flex-shrink-0">
            <GameControls />
          </div>
        </div>

        <footer className="text-center mt-12 text-amber-600 text-sm">
          <p>使用 Pikafish 引擎提供 AI 支持</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
