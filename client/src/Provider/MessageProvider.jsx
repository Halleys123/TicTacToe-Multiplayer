import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MessageContext from '../context/MessageContext';

function Message({ message, success, insertTime, duration }) {
  const lineRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const interval = setInterval(() => {
      const newTimeElapsed = Date.now() - insertTime;
      const percentage = Math.min((newTimeElapsed / duration) * 100, 100);

      lineRef.current.style.width = `${100 - percentage}%`;

      if (percentage === 100) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, insertTime, lineRef]);

  return (
    <div
      className={`relative max-w-96 min-w-64 rounded-lg shadow-lg overflow-hidden ${
        success
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}
    >
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700'>
        <div
          ref={lineRef}
          className={`h-full transition-all ${
            success ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
      <div className='p-4 pt-5'>
        <div className='flex items-start gap-3'>
          <div
            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
              success ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span className='text-white text-xs'>{success ? '✓' : '✕'}</span>
          </div>
          <p className='text-sm text-gray-800 dark:text-gray-200 flex-1'>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function addMessage(message, success = true, duration = 3000) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message,
        success,
        id: Date.now(),
        insertTime: Date.now(),
        duration,
      },
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, duration + 100); // +100 to ensure the progress bar finishes before removal
  }

  function modifyInsertTime(id, newInsertTime) {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, insertTime: newInsertTime } : msg
      )
    );
  }

  return (
    <MessageContext.Provider value={{ addMessage }}>
      {children}
      {createPortal(
        <div className='absolute right-4 bottom-4 flex flex-col gap-4 z-50'>
          {messages.map(({ id, message, success, duration, insertTime }) => (
            <Message
              key={id}
              message={message}
              success={success}
              insertTime={insertTime}
              duration={duration}
              modifyInsertTime={(newInsertTime) =>
                modifyInsertTime(id, newInsertTime)
              }
            />
          ))}
        </div>,
        document.body
      )}
    </MessageContext.Provider>
  );
}
