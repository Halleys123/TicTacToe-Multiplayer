import { useContext } from 'react';
import GameStateContext from '../context/GameStateContext';

export default function useGameState() {
  const ctx = useContext(GameStateContext);

  if (!ctx) {
    throw new Error('Not inside a GameStateProvider');
  }

  return ctx;
}
