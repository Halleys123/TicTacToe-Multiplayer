import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import useSocket from '../hooks/useSocket.jsx';
import GameBox from '../components/Game/GameBox.jsx';

export default function GamePage() {
  const { socket } = useSocket();
  const onlineGame = window.location.search.includes('mode=online');

  console.log(onlineGame);
  const navigate = useNavigate();

  const [gameState, setGameState] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [message, setMessage] = useState('');
  // Initialize from localStorage if available (from match_found event)
  const [myTurn, setMyTurn] = useState(() => {
    const stored = localStorage.getItem('my_turn');
    return stored === 'true';
  });
  const [winner, setWinner] = useState(null);

  function onClickTile(row, col) {
    if (onlineGame) {
      socket?.emit('game_update', { row, col });
      return;
    }
    let turn = myTurn ? 'X' : 'O';

    if (winner) return;
    if (gameState[row][col] !== '') return;

    const newState = [...gameState];
    newState[row] = [...newState[row]];
    newState[row][col] = turn;

    setGameState(newState);

    // winner check
    // Row check
    if (
      newState[row][0] === turn &&
      newState[row][1] === turn &&
      newState[row][2] === turn
    ) {
      setWinner(turn);
      setMessage(`${turn} wins!`);
      return;
    }
    // Column check
    if (
      newState[0][col] === turn &&
      newState[1][col] === turn &&
      newState[2][col] === turn
    ) {
      setWinner(turn);
      setMessage(`${turn} wins!`);

      return;
    }

    // Diagonal check
    if (row === col) {
      if (
        newState[0][0] === turn &&
        newState[1][1] === turn &&
        newState[2][2] === turn
      ) {
        setWinner(turn);
        setMessage(`${turn} wins!`);

        return;
      }
    }
    if (row + col === 2) {
      if (
        newState[0][2] === turn &&
        newState[1][1] === turn &&
        newState[2][0] === turn
      ) {
        setWinner(turn);
        setMessage(`${turn} wins!`);
        return;
      }
    }

    // Tie check
    if (newState.flat().every((cell) => cell !== '')) {
      setMessage(`It's a tie!`);
      setWinner('tie');
      return;
    }

    setMyTurn(!myTurn);
    localStorage.setItem('my_turn', (!myTurn).toString());
  }

  function goBack() {
    navigate('/');
  }

  function onRestart() {
    if (!onlineGame) {
      setGameState([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]);
      setWinner(null);
    }
  }

  useEffect(() => {
    if (!socket || !onlineGame) return;

    const handleGameMessage = (data) => {
      console.log('Game update received:', data);
      if (data.success === false) {
        setMessage(data.message);
        return;
      }
      setGameState(data.data.game_board);
      if (localStorage.getItem('user_id') === data.data.current_turn) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    };
    const noGameHandler = () => {
      console.log('Not in game');
      alert('Not in game anymore');
      setMessage('Not in game anymore');
      setGameState([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ]);
      setMyTurn(false);
      navigate('/');
    };
    const gameOverHandler = (data) => {
      console.log('Game over:', data);
      setMessage(data.message);
      setGameState(data.data);
      setMyTurn(false);
      setWinner(data.winner);
    };

    const gameCurrentTurnHandler = (currentTurn) => {
      console.log('Current turn:', currentTurn);
      if (localStorage.getItem('user_id') == currentTurn) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    };

    const matchFoundHandler = (data) => {
      console.log('Match found in GamePage:', data);
      if (data.game?.game_board) {
        setGameState(data.game.game_board);
      }
      if (data.myTurn !== undefined) {
        setMyTurn(data.myTurn);
      }
    };

    socket.on('no_game', noGameHandler);
    socket.on('game_message', handleGameMessage);
    socket.on('game_over', gameOverHandler);
    socket.on('game_current_turn', gameCurrentTurnHandler);
    socket.on('match_found', matchFoundHandler);

    return () => {
      socket.off('no_game', noGameHandler);
      socket.off('game_message', handleGameMessage);
      socket.off('game_over', gameOverHandler);
      socket.off('game_current_turn', gameCurrentTurnHandler);
      socket.off('match_found', matchFoundHandler);
    };
  }, [socket, navigate, onlineGame]);

  return (
    <div className='w-screen min-h-screen flex items-center justify-center flex-col '>
      {createPortal(
        <div
          id='invisible-wall'
          className={
            !myTurn && onlineGame
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
              {winner === 'tie' ? 'Game Tied!' : winner ? `${winner} Won!` : ``}
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
              onClick={onRestart}
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
