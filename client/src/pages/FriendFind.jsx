import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import useSocket from '../hooks/useSocket';
import useMessage from '../hooks/useMessage';

export default function FriendFind() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [gameCode, setGameCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [mode, setMode] = useState(null);

  const { setLoading } = useLoading();
  const { socket } = useSocket();
  const { addMessage } = useMessage();

  useEffect(() => {
    document.title = 'Friend Match - Tic Tac Toe';
    setPlayer({
      name: localStorage.getItem('user_name') || 'Loading...',
      id: localStorage.getItem('user_id') || 'Loading...',
      email: localStorage.getItem('user_email') || 'Loading...',
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data) => {
      console.log('Friend match found:', data);

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

  const handleCreateGame = async () => {
    setIsCreating(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/game/create-friend-match`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      const data = await res.json();
      console.log('Create game response:', data);

      if (data.success) {
        setGeneratedCode(data.data);
        setMode('create');
        addMessage(data.message, true, 3000);
      } else {
        addMessage(data.message || 'Failed to create game', false, 3000);
      }
    } catch (error) {
      console.error('Error creating game:', error);
      addMessage('Failed to create game', false, 3000);
    } finally {
      setIsCreating(false);
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      addMessage('Please enter a game code', false, 2000);
      return;
    }

    setIsJoining(true);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/game/join-friend-match`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ roomIdKey: gameCode.trim() }),
        }
      );
      const data = await res.json();
      console.log('Join game response:', data);

      if (data.success) {
        setMode('join');
        addMessage('Joining game...', true, 2000);
        // Socket will handle navigation via match_found event
      } else {
        addMessage(data.message || 'Failed to join game', false, 3000);
      }
    } catch (error) {
      console.error('Error joining game:', error);
      addMessage('Failed to join game', false, 3000);
    } finally {
      setIsJoining(false);
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    addMessage('Code copied to clipboard!', true, 2000);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleReset = () => {
    setMode(null);
    setGeneratedCode('');
    setGameCode('');
  };

  return (
    <div className='w-screen min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      <div className='flex flex-col gap-6 max-w-6xl w-full'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50'>
          <div className='flex items-center gap-3'>
            <div className='w-3 h-3 bg-purple-500 rounded-full animate-pulse'></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-white font-sans'>
              Friend Match
            </h1>
          </div>
          <button
            className='px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-red-600/50'
            onClick={handleGoBack}
          >
            Go Back
          </button>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-white font-sans tracking-tight'>
                You
              </h2>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-gray-800/40 rounded-lg'>
                <span className='text-sm font-medium text-gray-400'>Name</span>
                <span className='text-base font-semibold text-white'>
                  {player?.name || 'Loading...'}
                </span>
              </div>
              <div className='flex items-center justify-between p-3 bg-gray-800/40 rounded-lg'>
                <span className='text-sm font-medium text-gray-400'>ID</span>
                <span className='text-xs font-mono text-gray-300 truncate max-w-[200px]'>
                  {player?.id || 'Loading...'}
                </span>
              </div>
            </div>
          </div>

          <div className='hidden lg:flex items-center justify-center'>
            <div className='text-4xl text-gray-600 font-bold'>VS</div>
          </div>

          <div className='flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-white font-sans tracking-tight'>
                {mode === 'create'
                  ? 'Waiting for Friend'
                  : mode === 'join'
                  ? 'Joining Game'
                  : 'Choose Option'}
              </h2>
              {mode && (
                <button
                  className='text-sm text-gray-400 hover:text-white transition-colors'
                  onClick={handleReset}
                >
                  Reset
                </button>
              )}
            </div>

            {!mode && (
              <div className='space-y-4'>
                <button
                  className='w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleCreateGame}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Game'
                  )}
                </button>

                <div className='flex items-center gap-3'>
                  <div className='flex-1 h-px bg-gray-700'></div>
                  <span className='text-sm text-gray-500 font-medium'>OR</span>
                  <div className='flex-1 h-px bg-gray-700'></div>
                </div>

                <div className='space-y-3'>
                  <input
                    type='text'
                    placeholder='Enter Game Code'
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    className='w-full p-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
                  />
                  <button
                    className='w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={handleJoinGame}
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <div className='flex items-center justify-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                        Joining...
                      </div>
                    ) : (
                      'Join Game'
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === 'create' && (
              <div className='space-y-4'>
                <div className='p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg'>
                  <div className='text-sm text-purple-300/70 mb-2'>
                    Game Code
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='text-lg font-bold text-purple-400 font-mono tracking-wider'>
                      {generatedCode}
                    </div>
                    <button
                      className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors'
                      onClick={handleCopyCode}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className='p-4 bg-gray-800/40 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
                    <span className='text-sm text-yellow-400 font-medium'>
                      Waiting for friend to join...
                    </span>
                  </div>
                  <p className='text-sm text-gray-400'>
                    Share this code with your friend so they can join your game.
                  </p>
                </div>
              </div>
            )}

            {mode === 'join' && (
              <div className='space-y-4'>
                <div className='p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg'>
                  <div className='text-sm text-blue-300/70 mb-2'>
                    Joining Game
                  </div>
                  <div className='text-lg font-semibold text-blue-400 font-mono'>
                    {gameCode}
                  </div>
                </div>

                <div className='p-4 bg-gray-800/40 rounded-lg'>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                    <span className='text-sm text-green-400 font-medium'>
                      Connecting to game...
                    </span>
                  </div>
                  <p className='text-sm text-gray-400'>
                    Please wait while we connect you to your friend's game.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
