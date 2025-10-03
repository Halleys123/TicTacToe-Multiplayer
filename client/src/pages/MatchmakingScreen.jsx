import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import useSocket from '../hooks/useSocket';

async function startMatchMaking(setLoading) {
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

  const { setLoading } = useLoading();
  const { socket } = useSocket();

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

      if (data.myTurn !== undefined) {
        localStorage.setItem('my_turn', data.myTurn.toString());
      }

      navigate(`/game?mode=online&id=${data.gameId}`);
    };

    socket.on('match_found', handleMatchFound);

    return () => {
      socket.off('match_found', handleMatchFound);
    };
  }, [socket, navigate]);

  const PlayerCard = ({ title, player, isSearching }) => (
    <div className='flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-white font-sans tracking-tight'>
          {title}
        </h2>
        {isSearching && (
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
            <span className='text-sm text-yellow-400 font-medium'>
              Searching...
            </span>
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between p-3 bg-gray-800/40 rounded-lg'>
          <span className='text-sm font-medium text-gray-400'>Name</span>
          <span className='text-base font-semibold text-white'>
            {player?.name || 'Waiting...'}
          </span>
        </div>
        <div className='flex items-center justify-between p-3 bg-gray-800/40 rounded-lg'>
          <span className='text-sm font-medium text-gray-400'>ID</span>
          <span className='text-xs font-mono text-gray-300 truncate max-w-[200px]'>
            {player?.id || 'Waiting...'}
          </span>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-3 bg-green-900/20 border border-green-700/30 rounded-lg text-center'>
            <div className='text-2xl font-bold text-green-400'>
              {player?.wins || 0}
            </div>
            <div className='text-xs text-green-300/70 mt-1'>Wins</div>
          </div>
          <div className='p-3 bg-red-900/20 border border-red-700/30 rounded-lg text-center'>
            <div className='text-2xl font-bold text-red-400'>
              {player?.loses || 0}
            </div>
            <div className='text-xs text-red-300/70 mt-1'>Losses</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='w-screen min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      <div className='flex flex-col gap-6 max-w-6xl w-full'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50'>
          <div className='flex items-center gap-3'>
            <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-white font-sans'>
              Finding Match
            </h1>
          </div>
          <button
            className='px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-red-600/50'
            onClick={goBack}
          >
            Cancel & Go Back
          </button>
        </div>

        {/* Players Section */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <PlayerCard title='You' player={player} isSearching={false} />

          <div className='hidden lg:flex items-center justify-center'>
            <div className='text-4xl text-gray-600 font-bold'>VS</div>
          </div>

          <PlayerCard
            title='Opponent'
            player={otherPlayer}
            isSearching={!otherPlayer}
          />
        </div>
      </div>
    </div>
  );
}
