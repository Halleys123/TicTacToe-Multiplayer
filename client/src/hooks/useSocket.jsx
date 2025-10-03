import { useContext } from 'react';
import SocketContext from '../context/SocketContext.jsx';

export default function useSocket() {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error('Not inside a SocketProvider');
  }

  return ctx;
}
