import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

export default function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('Not inside an AuthProvider');
  }

  return ctx;
}
