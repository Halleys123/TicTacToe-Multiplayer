import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center space-y-8 p-8'>
      {/* Title */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-6xl font-PressStart2P text-gray-800 dark:text-white mb-4'>
          TIC TAC TOE
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-300 font-medium'>
          Choose your game mode
        </p>
      </div>

      {/* Game Mode Buttons */}
      <div className='flex flex-col space-y-4 w-full max-w-md'>
        <button
          onClick={() => navigate('/game?mode=local-multiplayer')}
          className='w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          Local Multiplayer
        </button>

        <button
          //   onClick={handleMultiplayerGame}
          className='w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          👥 Multiplayer Game
        </button>

        <button
          //   onClick={handleLeaderboard}
          className='w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
        >
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}
