import React from 'react';

export default function LeaderboardEntry({ rank, name, score }) {
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-black';
      default:
        return 'bg-gradient-to-r from-gray-700 to-gray-800 text-white';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl shadow-lg transform hover:scale-102 transition-all duration-200 ${getRankStyle(
        rank
      )}`}
    >
      <div className='flex items-center gap-4'>
        <div className='text-2xl font-bold min-w-[3rem] text-center'>
          {getRankIcon(rank)}
        </div>
        <div className='flex flex-col'>
          <span className='font-PressStart2P text-lg'>{name}</span>
          <span className='text-sm opacity-80'>Player</span>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <span className='font-PressStart2P text-xl font-bold'>{score}</span>
        <span className='text-sm opacity-80'>points</span>
      </div>
    </div>
  );
}
