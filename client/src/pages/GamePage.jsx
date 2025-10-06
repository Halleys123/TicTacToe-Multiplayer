import { useEffect, useRef, useState } from 'react';
import GameBox from '../components/Game/GameBox';
import useSocket from '../hooks/useSocket';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import useMessage from '../hooks/useMessage';

export default function GamePage() {
  const { socket } = useSocket();
  const onlineGame = window.location.search.includes('mode=online');

  const timerRef = useRef(0);
  const timerValRef = useRef(null);

  const navigate = useNavigate();
  const { addMessage } = useMessage();

  const [gameState, setGameState] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
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
      addMessage(`${turn} wins!`, true, 3000);
      return;
    }
    // Column check
    if (
      newState[0][col] === turn &&
      newState[1][col] === turn &&
      newState[2][col] === turn
    ) {
      setWinner(turn);
      addMessage(`${turn} wins!`, true, 3000);

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
        addMessage(`${turn} wins!`, true, 3000);

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
        addMessage(`${turn} wins!`, true, 3000);
        return;
      }
    }

    // Tie check
    if (newState.flat().every((cell) => cell !== '')) {
      addMessage(`It's a tie!`, true, 3000);
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

    const handleGameTimer = (data) => {
      console.log('Timer update received:', data);
      if (!timerValRef.current) {
        console.warn('Timer ref not ready yet');
        return;
      }
      let val = Math.ceil(data.data);
      timerValRef.current.innerText = `Timer: ${val}s`;
      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        if (timerValRef.current) {
          timerValRef.current.innerText = `Time Elapsed: ${++val}s`;
        }
      }, 1000);
    };

    const handleGameMessage = (data) => {
      console.log('Game update received:', data);
      if (data.success === false) {
        addMessage(data.message, false, 3000);
        return;
      }
      console.log(data.data.game_board);
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
      addMessage('Not in game anymore', false, 3000);
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
      clearInterval(timerRef.current);
      if (data.winner === 'tie') {
        addMessage(`Game tied!`, true, 3000);
      } else {
        addMessage(`${data.winner} wins!`, true, 3000);
      }
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
    socket.on('timer_update', handleGameTimer);

    return () => {
      socket.off('no_game', noGameHandler);
      socket.off('game_message', handleGameMessage);
      socket.off('game_over', gameOverHandler);
      socket.off('game_current_turn', gameCurrentTurnHandler);
      socket.off('match_found', matchFoundHandler);
      socket.off('timer_update', handleGameTimer);
      clearInterval(timerRef.current);
    };
  }, [socket, navigate, onlineGame, addMessage, timerRef, timerValRef]);

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
          <span
            ref={timerValRef}
            className='text-xl font-PressStart2P font-medium text-gray-700 dark:text-gray-300'
          >
            Timer: 20s
          </span>
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
