import { useEffect, useState } from 'react';
import GameBox from '../components/Game/GameBox';
import useSocket from '../hooks/useSocket';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export default function GamePage() {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [message, setMessage] = useState('');
  const [currentTurn, setCurrentTurn] = useState('X');
  const [myTurn, setMyTurn] = useState(false);
  function onClickTile(row, col) {
    socket?.emit('game_update', { row, col });
  }

  useEffect(() => {
    if (!socket) return;

    const handleGameMessage = (data) => {
      console.log('Game update received:', data);
      if (data.success === false) {
        setMessage(data.message);
        return;
      }
      setGameState(data.data.game_board);
      setCurrentTurn(data.data[data.data.current_turn]);
      if (localStorage.getItem('user_id') === data.data.current_turn) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    };
    socket.on('no_game', () => {
      console.log('Not in game');
      alert('Not in game anymore');
      setMessage('Not in game anymore');
      setGameState([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]);
      setCurrentTurn('X');
      setMyTurn(false);
      navigate('/');
    });
    socket.on('game_message', handleGameMessage);

    return () => {
      socket.off('game_message', handleGameMessage);
    };
  }, [socket]);

  return (
    <div className='w-screen min-h-screen flex items-center justify-center flex-col '>
      {createPortal(
        <div
          id='invisible-wall'
          className={
            !myTurn
              ? 'absolute top-0 left-0 h-screen w-screen z-10 cursor-not-allowed'
              : 'hidden'
          }
        ></div>,
        document.body
      )}
      {message &&
        createPortal(
          <div className='absolute top-0 left-0 h-screen w-screen z-10 backdrop-blur-xl bg-white/10 flex items-center justify-center fade-in'>
            <div className='flex flex-col max-w-md p-8 w-full min-h-96 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70'>
              <div className='flex flex-row mb-8 justify-between items-center'>
                <span className='font-PressStart2P text-xl text-white text-center'>
                  Message from Server
                </span>
                <button
                  onClick={() => setMessage('')}
                  className='ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  Close
                </button>
              </div>
              <span className='text-white font-PressStart2P text-lg'>
                {message}
              </span>
            </div>
          </div>,
          document.body
        )}
      <div className='w-full max-w-xl'>
        <div className='flex flex-row mb-8 justify-between items-center'>
          <div className='flex-1 flex flex-row gap-2'>
            <span className='text-xl font-PressStart2P font-medium text-gray-700 dark:text-gray-300'>
              {/* {winner === 'tie'
                ? 'Game Tied!'
                : winner
                ? `${winner} Won!`
                : `${currentTurn}'s Turn`} */}
            </span>

            <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
              {myTurn ? 'Your Turn' : "Opponent's Turn"}
            </span>
          </div>

          <div className='flex-1 text-center'>
            <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
              Turn Current
            </span>
          </div>

          <div className='flex-1 flex flex-row-reverse justify-end'>
            <button
              // onClick={restartGame}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 ml-2 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Restart
            </button>
            <button
              // onClick={goBack}
              className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm font-PressStart2P rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Go Back
            </button>
          </div>
        </div>

        <GameBox gameState={gameState} handleButtonClick={onClickTile} />

        <div className='flex flex-row mt-8 justify-between items-center'>
          {/* <div className='flex-1'>
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
