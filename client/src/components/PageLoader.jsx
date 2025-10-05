import { createPortal } from 'react-dom';

export default function PageLoader() {
  return createPortal(
    <div className='absolute top-0 left-0 h-screen w-screen bg-neutral-800/20 blur-2xl backdrop-blur-2xl z-50'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin'></div>
      </div>
    </div>,
    document.body
  );
}
