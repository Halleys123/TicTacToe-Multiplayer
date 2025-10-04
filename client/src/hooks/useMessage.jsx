import MessageContext from '../context/MessageContext';

import { useContext } from 'react';

export default function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error('Not inside a MessageProvider');
  }
  return ctx;
}
