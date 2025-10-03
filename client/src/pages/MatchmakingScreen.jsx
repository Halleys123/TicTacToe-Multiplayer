import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import useSocket from '../hooks/useSocket';

async function startMatchMaking(setLoading, setOtherPlayer) {
  setLoading(true);

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/game/random-match-make`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }
  );
  const data = await res.json();
  console.log('Matchmaking response:', data);

  setLoading(false);

  alert(data.message);
}

export default function MatchmakingScreen() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [otherPlayer, setOtherPlayer] = useState(null);

  const { loading, setLoading } = useLoading();
  const { socket, setSocket } = useSocket();

  function goBack() {
    navigate('/');
  }

  useEffect(() => {
    setLoading(true);
    document.title = 'Matchmaking - Tic Tac Toe';
    startMatchMaking(setLoading, setOtherPlayer);
    setPlayer({
      name: localStorage.getItem('user_name') || 'Loading...',
      id: localStorage.getItem('user_id') || 'Loading...',
      email: localStorage.getItem('user_email') || 'Loading...',
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data) => {
      console.log('Match found:', data);
      setOtherPlayer({
        name: data.otherData.displayName,
        id: data.otherData._id,
        email: data.otherData.email,
      });

      // Store turn info in localStorage so GamePage can access it
      if (data.myTurn !== undefined) {
        localStorage.setItem('my_turn', data.myTurn.toString());
      }

      navigate(`/game?id=${data.gameId}`);
    };

    socket.on('match_found', handleMatchFound);

    return () => {
      socket.off('match_found', handleMatchFound);
    };
  }, [socket, navigate]);

  return (
    <div className='w-screen min-h-screen flex items-center justify-center flex-col p-6'>
      <div className='flex flex-col gap-4 max-w-5xl w-full min-h-96'>
        <div className='flex flex-row items-center gap-4'>
          <span className='font-PressStart2P text-xl text-white'>
            MatchMaking
          </span>
          <button
            className='flex items-center justify-center ml-4 px-4 h-10 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold transition-colors'
            onClick={goBack}
          >
            Go Back
          </button>
        </div>
        <div className='flex flex-row flex-1 w-full outline outline-white rounded-2xl'>
          <div className='flex-1 w-full p-8'>
            <span className='text-xl font-PressStart2P  font-medium text-white text-center w-full'>
              Player 1
            </span>

            <div className='grid grid-cols-2 gap-1 mt-8'>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Name
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {player?.name || 'Loading...'}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                ID
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {player?.id || 'Loading...'}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Wins
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {player?.wins || 0}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Loses
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {player?.loses || 0}
              </span>
            </div>
          </div>
          <div className='border-l self-stretch border-white'></div>
          <div className='flex-1 w-full p-8'>
            <span className='text-xl font-PressStart2P  font-medium text-white text-center w-full'>
              Player 2
            </span>

            <div className='grid grid-cols-2 gap-1 mt-8'>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Name
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {otherPlayer?.name || 'Loading...'}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                ID
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {otherPlayer?.id || 'Loading...'}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Wins
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {otherPlayer?.wins || 0}
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                Loses
              </span>
              <span className='text-lg font-PressStart2P font-medium text-gray-600 dark:text-gray-400'>
                {otherPlayer?.loses || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
