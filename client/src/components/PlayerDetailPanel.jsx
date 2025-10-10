import React from 'react';

export default function PlayerDetailPanel({
  player,
  stats,
  recentMatches,
  loading,
}) {
  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-neutral-500'>
        <svg
          className='w-20 h-20 mb-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
        <p className='text-sm font-semibold'>Select a player to view details</p>
      </div>
    );
  }

  const winPercentage =
    stats.totalGames > 0
      ? ((stats.wins / stats.totalGames) * 100).toFixed(1)
      : 0;
  const lossPercentage =
    stats.totalGames > 0
      ? ((stats.losses / stats.totalGames) * 100).toFixed(1)
      : 0;
  const drawPercentage =
    stats.totalGames > 0
      ? ((stats.draws / stats.totalGames) * 100).toFixed(1)
      : 0;

  return (
    <div className='flex flex-col h-full'>
      {/* Player Info Header */}
      <div className='p-4 border-b border-neutral-700'>
        <h2 className='text-2xl font-bold text-white mb-2'>
          {player.username}
        </h2>
        <div className='flex gap-4 text-sm'>
          <div className='bg-green-600/20 px-3 py-1 rounded border border-green-600/50'>
            <span className='text-green-400 font-bold'>{stats.wins}</span>
            <span className='text-neutral-400 ml-1'>Wins</span>
          </div>
          <div className='bg-red-600/20 px-3 py-1 rounded border border-red-600/50'>
            <span className='text-red-400 font-bold'>{stats.losses}</span>
            <span className='text-neutral-400 ml-1'>Losses</span>
          </div>
          <div className='bg-yellow-600/20 px-3 py-1 rounded border border-yellow-600/50'>
            <span className='text-yellow-400 font-bold'>{stats.draws}</span>
            <span className='text-neutral-400 ml-1'>Draws</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='p-4 border-b border-neutral-700'>
        <h3 className='text-sm font-semibold text-neutral-400 mb-3'>
          STATISTICS
        </h3>
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-neutral-800/50 p-3 rounded'>
            <div className='text-xs text-neutral-500 mb-1'>Total Games</div>
            <div className='text-xl font-bold text-white'>
              {stats.totalGames}
            </div>
          </div>
          <div className='bg-neutral-800/50 p-3 rounded'>
            <div className='text-xs text-neutral-500 mb-1'>Win Rate</div>
            <div className='text-xl font-bold text-green-400'>
              {winPercentage}%
            </div>
          </div>
          <div className='bg-neutral-800/50 p-3 rounded'>
            <div className='text-xs text-neutral-500 mb-1'>Loss Rate</div>
            <div className='text-xl font-bold text-red-400'>
              {lossPercentage}%
            </div>
          </div>
          <div className='bg-neutral-800/50 p-3 rounded'>
            <div className='text-xs text-neutral-500 mb-1'>Draw Rate</div>
            <div className='text-xl font-bold text-yellow-400'>
              {drawPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className='flex-1 overflow-y-auto p-4'>
        <h3 className='text-sm font-semibold text-neutral-400 mb-3'>
          RECENT MATCHES
        </h3>
        {recentMatches && recentMatches.length > 0 ? (
          <div className='space-y-2'>
            {recentMatches.map((match, index) => (
              <div
                key={index}
                className='bg-neutral-800/50 p-2 rounded flex items-center justify-between text-xs'
              >
                <div className='flex-1 min-w-0'>
                  <div className='text-white font-semibold truncate'>
                    vs {match.opponent}
                  </div>
                  <div className='text-neutral-500'>
                    {match.playerMove && match.opponentMove ? (
                      <span>
                        {match.playerMove.toUpperCase()} vs{' '}
                        {match.opponentMove.toUpperCase()}
                      </span>
                    ) : (
                      <span>Game #{match.gameId.slice(-6)}</span>
                    )}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded font-bold ${
                    match.result === 'win'
                      ? 'bg-green-600/20 text-green-400'
                      : match.result === 'loss'
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}
                >
                  {match.result.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-neutral-500 py-8'>
            <p className='text-sm'>No recent matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}
