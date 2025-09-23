import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 backdrop-blur shadow-xl'>
          <div className='px-6 pt-8 pb-4 text-center'>
            <h1 className='text-3xl md:text-4xl tracking-wide font-PressStart2P text-gray-800 dark:text-white'>
              TIC TAC TOE
            </h1>
            <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
              Pick a mode to get started
            </p>
          </div>

          <div className='px-6 pb-6 flex flex-col gap-3'>
            <button
              onClick={() => navigate('/game?mode=local-multiplayer')}
              className='w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors'
            >
              Local multiplayer
            </button>

            <button className='w-full h-12 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold transition-colors'>
              Multiplayer (coming soon)
            </button>

            <button className='w-full h-12 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white font-semibold transition-colors'>
              Leaderboard
            </button>

            <div className='relative my-2'>
              <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 select-none'>
                <span className='flex-1 h-px bg-gray-200 dark:bg-white/10' />
                <span>or</span>
                <span className='flex-1 h-px bg-gray-200 dark:bg-white/10' />
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className='w-full h-11 rounded-lg border border-gray-300 dark:border-white/15 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium flex items-center justify-center gap-3 transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 48 48'
                aria-hidden='true'
              >
                <path
                  fill='#FFC107'
                  d='M43.611 20.083H42V20H24v8h11.303C33.602 32.91 29.197 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.757 6.053 29.646 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z'
                />
                <path
                  fill='#FF3D00'
                  d='M6.306 14.691l6.571 4.817C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.757 6.053 29.646 4 24 4 16.318 4 9.656 8.337 6.306 14.691z'
                />
                <path
                  fill='#4CAF50'
                  d='M24 44c5.113 0 9.76-1.953 13.283-5.148l-6.142-5.2C29.016 35.091 26.62 36 24 36c-5.176 0-9.567-3.064-11.289-7.462l-6.54 5.036C9.5 39.556 16.227 44 24 44z'
                />
                <path
                  fill='#1976D2'
                  d='M43.611 20.083H42V20H24v8h11.303c-1.086 3.174-3.52 5.693-6.617 6.983.001-.001 6.142 5.2 6.142 5.2C37.297 41.231 44 36.5 44 24c0-1.341-.138-2.65-.389-3.917z'
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
