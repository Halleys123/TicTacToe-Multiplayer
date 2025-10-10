import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardListItem from '../components/LeaderboardListItem';
import PlayerDetailPanel from '../components/PlayerDetailPanel';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('max-win');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Leaderboard - Tic Tac Toe';
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/game/leaderboard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sortBy: sortBy,
            pageNumber: 1,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPlayers(data.data || []);
        // Auto-select first player if none selected
        if (data.data && data.data.length > 0 && !selectedPlayer) {
          handlePlayerSelect(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = async (player) => {
    setSelectedPlayer(player);
    setDetailsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/game/player/${player.playerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPlayerDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center p-4'>
      <div className='flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800 max-w-7xl w-full h-[85vh] rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden'>
        {/* Header */}
        <div className='text-center p-4 border-b border-neutral-700 bg-neutral-900/50'>
          <h1 className='text-3xl font-PressStart2P text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2'>
            Leaderboard
          </h1>
          <div className='flex justify-center gap-2 mt-3'>
            <button
              onClick={() => setSortBy('max-win')}
              className={`px-3 py-1 text-xs rounded transition ${
                sortBy === 'max-win'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Most Wins
            </button>
            <button
              onClick={() => setSortBy('highest-win-ratio')}
              className={`px-3 py-1 text-xs rounded transition ${
                sortBy === 'highest-win-ratio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Highest Win %
            </button>
            <button
              onClick={() => setSortBy('lowest-win-ratio')}
              className={`px-3 py-1 text-xs rounded transition ${
                sortBy === 'lowest-win-ratio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Lowest Win %
            </button>
          </div>
        </div>

        {/* Split Layout */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Left: Player List */}
          <div className='w-1/3 border-r border-neutral-700 flex flex-col'>
            <div className='p-3 border-b border-neutral-700 bg-neutral-900/30'>
              <h2 className='text-sm font-semibold text-neutral-400'>
                PLAYERS
              </h2>
            </div>
            <div className='flex-1 overflow-y-auto'>
              {loading ? (
                <div className='flex items-center justify-center h-full'>
                  <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
                </div>
              ) : import.meta.env.VITE_NODE_ENV === 'development' ? (
                <>
                  {[
                    {
                      playerId: '1',
                      username: 'Champion',
                      wins: 150,
                      losses: 30,
                      draws: 20,
                      totalGames: 200,
                    },
                    {
                      playerId: '2',
                      username: 'ProGamer',
                      wins: 120,
                      losses: 50,
                      draws: 30,
                      totalGames: 200,
                    },
                    {
                      playerId: '3',
                      username: 'TicTacMaster',
                      wins: 95,
                      losses: 60,
                      draws: 45,
                      totalGames: 200,
                    },
                    {
                      playerId: '4',
                      username: 'Player4',
                      wins: 80,
                      losses: 70,
                      draws: 50,
                      totalGames: 200,
                    },
                    {
                      playerId: '5',
                      username: 'Beginner',
                      wins: 45,
                      losses: 100,
                      draws: 55,
                      totalGames: 200,
                    },
                  ].map((player, index) => (
                    <LeaderboardListItem
                      key={player.playerId}
                      rank={index + 1}
                      player={player}
                      isSelected={selectedPlayer?.playerId === player.playerId}
                      onClick={() => handlePlayerSelect(player)}
                    />
                  ))}
                </>
              ) : players.length > 0 ? (
                players.map((player, index) => (
                  <LeaderboardListItem
                    key={player.playerId}
                    rank={index + 1}
                    player={player}
                    isSelected={selectedPlayer?.playerId === player.playerId}
                    onClick={() => handlePlayerSelect(player)}
                  />
                ))
              ) : (
                <div className='text-center text-neutral-500 py-8'>
                  <span className='text-sm'>No players yet</span>
                  <p className='text-xs mt-2'>
                    Be the first to join the leaderboard!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Player Details */}
          <div className='flex-1 bg-neutral-900/30'>
            {import.meta.env.VITE_NODE_ENV === 'development' ? (
              <PlayerDetailPanel
                player={selectedPlayer || { username: 'Champion' }}
                stats={{
                  wins: 150,
                  losses: 30,
                  draws: 20,
                  totalGames: 200,
                }}
                recentMatches={[
                  {
                    opponent: 'ProGamer',
                    playerMove: 'x',
                    opponentMove: 'o',
                    result: 'win',
                    gameId: 'abc123',
                  },
                  {
                    opponent: 'TicTacMaster',
                    playerMove: 'o',
                    opponentMove: 'x',
                    result: 'loss',
                    gameId: 'def456',
                  },
                  {
                    opponent: 'Player4',
                    playerMove: 'x',
                    opponentMove: 'o',
                    result: 'win',
                    gameId: 'ghi789',
                  },
                  {
                    opponent: 'Beginner',
                    playerMove: 'o',
                    opponentMove: 'x',
                    result: 'draw',
                    gameId: 'jkl012',
                  },
                  {
                    opponent: 'ProGamer',
                    playerMove: 'x',
                    opponentMove: 'o',
                    result: 'win',
                    gameId: 'mno345',
                  },
                ]}
                loading={detailsLoading}
              />
            ) : (
              <PlayerDetailPanel
                player={playerDetails?.player}
                stats={playerDetails?.stats}
                recentMatches={playerDetails?.recentMatches}
                loading={detailsLoading}
              />
            )}
          </div>
        </div>
      </div>

      <button
        className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg'
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>
    </div>
  );
}
