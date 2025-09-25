import { createPortal } from 'react-dom';

export default function MultiplayerModal({ setShowModal = () => {} }) {
  return createPortal(
    <div
      onClick={() => {
        setShowModal(false);
      }}
      className='absolute top-0 left-0 h-screen w-screen z-10 backdrop-blur-xl bg-white/10 flex items-center justify-center fade-in'
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='flex flex-col max-w-md p-8 w-full min-h-96 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/70'
      >
        <span className='font-PressStart2P text-2xl text-white text-center'>
          Choose your Game Mode
        </span>
        <p className='mt-4 text-sm text-center text-gray-600 dark:text-gray-300'>
          Pick a mode to get started
        </p>
        <div className='w-full border-t border-gray-500 my-4'></div>
        <div className='flex flex-col gap-4 mt-4'>
          <button className='cursor-pointer w-full h-12 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold transition-colors'>
            With a Friend
          </button>
          <button className='cursor-pointer w-full h-12 rounded-lg bg-violet-600/90 hover:bg-violet-600 text-white font-semibold transition-colors'>
            Search Online
          </button>
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className='mt-24 cursor-pointer w-full h-12 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.querySelector('#root')
  );
}
