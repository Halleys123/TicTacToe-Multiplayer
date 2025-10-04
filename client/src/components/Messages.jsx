import { createPortal } from 'react-dom';

export default function Messages() {
  return createPortal(
    <div className='absolute bottom-4 right-4 flex flex-col'></div>,
    document.body
  );
}
