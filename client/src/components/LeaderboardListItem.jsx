import React from 'react';

export default function LeaderboardListItem({
  rank,
  player,
  isSelected,
  onClick,
}) {
  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const winPercentage =
    player.totalGames > 0
      ? Math.round((player.wins / player.totalGames) * 100)
      : 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-2 cursor-pointer transition-all duration-150 border-l-4 ${
        isSelected
          ? 'bg-blue-600/20 border-blue-500'
          : 'bg-neutral-800/50 border-transparent hover:bg-neutral-700/50 hover:border-neutral-600'
      }`}
    >
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <div className='text-sm font-bold min-w-[2.5rem] text-center text-neutral-300'>
          {getRankBadge(rank)}
        </div>
        <div className='flex flex-col min-w-0 flex-1'>
          <span className='font-semibold text-white text-sm truncate'>
            {player.username}
          </span>
          <span className='text-xs text-neutral-400'>
            {player.totalGames} games
          </span>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <div className='text-right'>
          <div className='text-sm font-bold text-green-400'>{player.wins}W</div>
          <div className='text-xs text-neutral-400'>{winPercentage}%</div>
        </div>
      </div>
    </div>
  );
}
