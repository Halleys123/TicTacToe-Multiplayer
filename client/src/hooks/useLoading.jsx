import { useContext } from 'react';
import LoadingContext from '../context/LoadingContext.jsx';

export default function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return ctx;
}
