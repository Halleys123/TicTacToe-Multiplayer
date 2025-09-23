import { useState } from 'react';
import GameBox from '../components/Game/GameBox';

export default function GamePage() {
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winCount, setWincount] = useState({ x: 0, o: 0, ties: 0 });

  const [gameState, setGameState] = useState(
    Array(3).fill(Array(3).fill(null))
  );

  function restartGame() {
    setPlayer('X');
    setWinner(null);
    setGameState(Array(3).fill(Array(3).fill(null)));
  }

  return (
    <div className='w-full h-full flex items-center justify-center flex-col'>
      <div className='w-full max-w-xl'>
        {/* Top Section: Current Turn | Turn Current | Restart Button */}
        <div className='flex flex-row mb-8 justify-between items-center'>
          {/* Top Left - Current Turn */}
          <div className='flex-1'>
            <span className='text-xl font-PressStart2P font-medium text-gray-700 dark:text-gray-300'>
              {winner === 'tie'
                ? 'Game Tied!'
                : winner
                ? `${winner} Won!`
                : `${player}'s Turn`}
            </span>
          </div>

          {/* Top Center - "Turn Current" */}
          <div className='flex-1 text-center'>
            <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
              Turn Current
            </span>
          </div>

          {/* Top Right - Restart Button */}
          <div className='flex-1 flex justify-end'>
            <button
              onClick={restartGame}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Restart
            </button>
          </div>
        </div>

        {/* Game Box */}
        <GameBox
          gameState={gameState}
          setGameState={setGameState}
          player={player}
          setPlayer={setPlayer}
          winner={winner}
          setWinner={setWinner}
          setWincount={setWincount}
        />

        {/* Bottom Section: Player 1 Wins | Ties | Player 2 Wins */}
        <div className='flex flex-row mt-8 justify-between items-center'>
          {/* Bottom Left - Player 1 (X) Wins */}
          <div className='flex-1'>
            <span className='text-xl font-PressStart2P font-medium text-player-two'>
              X: {winCount.x}
            </span>
          </div>

          {/* Bottom Center - Ties */}
          <div className='flex-1 text-center'>
            <span className='text-xl font-PressStart2P font-medium text-gray-600 dark:text-gray-300'>
              Ties: {winCount.ties}
            </span>
          </div>

          {/* Bottom Right - Player 2 (O) Wins */}
          <div className='flex-1 flex justify-end'>
            <span className='text-xl font-PressStart2P font-medium text-player-one'>
              O: {winCount.o}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
