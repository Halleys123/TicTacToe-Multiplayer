import useGameState from '../hooks/useGameState';
import { useNavigate } from 'react-router-dom';

export default function MatchmakingScreen() {
  const { myPlayer } = useGameState();
  const navigate = useNavigate();

  function goBack() {
    navigate('/');
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center  text-white p-4'>
      <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        <div className='flex flex-col items-center gap-6'>
          <h1 className='text-3xl md:text-4xl font-bold tracking-wide drop-shadow'>
            Matchmaking...
          </h1>
          <div className='relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-slate-800/70 border border-slate-600 shadow-xl'>
            <span className='absolute -top-3 -left-3 bg-indigo-600 text-xs px-2 py-1 rounded-md tracking-wider'>
              YOU
            </span>
            <span className='text-7xl font-extrabold select-none'>
              {myPlayer || 'X'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-sm text-slate-300 animate-pulse'>
            <span className='inline-block w-2 h-2 rounded-full bg-indigo-400' />
            <span>Searching for opponent</span>
            <span className='inline-block w-2 h-2 rounded-full bg-indigo-400' />
          </div>
        </div>

        <div className='relative flex items-center justify-center'>
          <div className='absolute inset-0 -m-4 blur-3xl opacity-40 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-purple-700 rounded-full animate-pulse' />
          <div className='relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72'>
            <div className='absolute inset-0 rounded-full border-8 border-slate-700/40 border-t-indigo-400 border-r-fuchsia-400 animate-spin [animation-duration:2800ms]' />
            <div className='absolute w-44 h-44 md:w-52 md:h-52 rounded-full border-8 border-slate-700/30 border-t-fuchsia-500 border-l-indigo-500 animate-spin [animation-duration:1800ms] [animation-direction:reverse]' />
            <div className='absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg shadow-indigo-900/40 animate-pulse' />
            <div className='w-4 h-4 rounded-full bg-white/90 shadow ring-2 ring-fuchsia-500/70 animate-ping [animation-duration:1600ms]' />
          </div>
        </div>
      </div>
      <div className='mt-10 flex flex-col items-center gap-4'>
        <div className='text-xs text-slate-400 tracking-wide uppercase'>
          Opponents online: fetching...
        </div>
        <button
          onClick={goBack}
          className='group relative px-6 py-3 rounded-lg font-semibold tracking-wide bg-slate-800/70 border border-slate-600 text-slate-200 hover:text-white hover:border-indigo-400 hover:bg-slate-700/70 transition shadow shadow-slate-900/40 overflow-hidden'
        >
          <span className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-600/20 via-fuchsia-600/20 to-purple-600/20 transition' />
          <span className='relative flex items-center gap-2'>
            <span className='inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse' />
            Cancel Matchmaking
          </span>
        </button>
      </div>
    </div>
  );
}
