import { useEffect, useState } from 'react';
import LeaderboardEntry from '../components/Leaderboard';

export default function Leaderboard() {
  // TODO: Add list virtualization for better performance with large datasets
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    document.title = 'Leaderboard - Tic Tac Toe';
  }, []);

  return (
    <div className='flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800 max-w-3xl w-full min-h-96 rounded-3xl shadow-2xl border border-neutral-700'>
      <div className='text-center p-6 border-b border-neutral-700'>
        <h1 className='text-4xl font-PressStart2P text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2'>
          🏆 Leaderboard
        </h1>
        <p className='text-neutral-400 text-sm'>Top Players Rankings</p>
      </div>

      <div id='virtualisation-parent'>
        <div id='virtulization' className='flex flex-col gap-3 p-6'>
          {import.meta.env.VITE_NODE_ENV === 'development' ? (
            <>
              <span className='text-white'>dev mode</span>
              <LeaderboardEntry rank={1} name='Champion' score={150} />
              <LeaderboardEntry rank={2} name='ProGamer' score={120} />
              <LeaderboardEntry rank={3} name='TicTacMaster' score={95} />
              <LeaderboardEntry rank={4} name='Player4' score={80} />
              <LeaderboardEntry rank={5} name='Beginner' score={45} />
            </>
          ) : players.length > 0 ? (
            players.map((player, index) => (
              <LeaderboardEntry
                key={player.id}
                rank={index + 1}
                name={player.name}
                score={player.score}
              />
            ))
          ) : (
            <div className='text-center text-neutral-500 py-8'>
              <span className='font-PressStart2P text-lg'>No players yet</span>
              <p className='text-sm mt-2'>
                Be the first to join the leaderboard!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
