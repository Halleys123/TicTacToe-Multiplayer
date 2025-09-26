import { useEffect } from 'react';
import GameBox from '../components/Game/GameBox';
import useGameState from '../hooks/useGameState';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const {
    gameMode,
    myPlayer,
    winner,
    gameState,
    winCount,
    currentTurn,
    setWinner,
    setGameState,
    setWincount,
    setCurrentTurn,
  } = useGameState();
  const Navigate = useNavigate();

  useEffect(() => {
    document.title = 'Game - Tic Tac Toe';
  }, []);

  function restartGame() {
    if (gameMode == 'local-multiplayer')
      setCurrentTurn('X'); // Do Something here
    else setWinner(null);
    setGameState(Array(3).fill(Array(3).fill(null)));
  }

  function goBack() {
    // TODO: Add confirmation modal
    Navigate(-1);
  }

  return (
    <div className='w-screen min-h-screen flex items-center justify-center flex-col '>
      <div className='w-full max-w-xl'>
        <div className='flex flex-row mb-8 justify-between items-center'>
          <div className='flex-1 flex flex-row gap-2'>
            <span className='text-xl font-PressStart2P font-medium text-gray-700 dark:text-gray-300'>
              {winner === 'tie'
                ? 'Game Tied!'
                : winner
                ? `${winner} Won!`
                : `${currentTurn}'s Turn`}
            </span>
            {gameMode == 'online-multiplayer' &&
              currentTurn == myPlayer &&
              (document.body.style.cursor = 'wait')}
          </div>

          <div className='flex-1 text-center'>
            <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
              Turn Current
            </span>
          </div>

          <div className='flex-1 flex flex-row-reverse justify-end'>
            <button
              onClick={restartGame}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 ml-2 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Restart
            </button>
            <button
              onClick={goBack}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Go Back
            </button>
          </div>
        </div>

        <GameBox
          gameState={gameState}
          setGameState={setGameState}
          player={currentTurn}
          setPlayer={setCurrentTurn}
          winner={winner}
          setWinner={setWinner}
          setWincount={setWincount}
        />

        <div className='flex flex-row mt-8 justify-between items-center'>
          <div className='flex-1'>
            <span className='text-xl font-PressStart2P font-medium text-player-two'>
              X: {winCount.x}
            </span>
          </div>

          <div className='flex-1 text-center'>
            <span className='text-xl font-PressStart2P font-medium text-gray-600 dark:text-gray-300'>
              Ties: {winCount.ties}
            </span>
          </div>

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
