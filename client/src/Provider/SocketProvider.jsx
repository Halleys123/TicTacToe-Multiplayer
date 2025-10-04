import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth.jsx';
import SocketContext from '../context/SocketContext.jsx';

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !socket) {
      const accessToken = localStorage.getItem('access_token');

      // Ensure access_token exists before connecting
      if (!accessToken) {
        console.error('No access token found, cannot connect to socket');
        return;
      }

      console.log('Connecting to socket server...');
      const newSocket = io('http://localhost:4000', {
        auth: {
          token: `Bearer ${accessToken}`,
        },
      });

      // IMPORTANT: Set socket BEFORE connect event
      // This ensures React updates and child components attach listeners
      // before server starts emitting events
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Connect error:', err.message);
        setIsConnected(false);
      });

      newSocket.on('auth_error', (msg) => {
        console.error('Auth error:', msg);
        // Optionally disconnect or show user feedback
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });

      return () => {
        console.log('Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const portalRoot = document.getElementById('root');
  const socketStatusPortal =
    portalRoot &&
    createPortal(
      <div className='absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 select-none'>
        Socket Status:
        <span
          className={`ml-1 font-mono ${
            isConnected ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>,
      portalRoot
    );

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
      {socketStatusPortal}
    </SocketContext.Provider>
  );
}
