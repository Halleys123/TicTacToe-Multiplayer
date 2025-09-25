import { useCallback, useMemo, useState } from 'react';
import GameStateContext from '../context/GameStateContext';

export default function GameStateProvider({ children }) {
  const [gameMode, _setGameMode] = useState('');

  const setGameMode = useCallback((next) => {
    if (!['local-multiplayer', 'online-multiplayer', ''].has(next)) {
      throw new Error('Invalid game mode');
    }
    _setGameMode(next);
  }, []);

  const [myPlayer, setMyPlayer] = useState('X');
  const [currentTurn, setCurrentTurn] = useState('X');

  const [winner, setWinner] = useState(null);
  const [winCount, setWincount] = useState({ x: 0, o: 0, ties: 0 });

  const [gameState, setGameState] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );

  const value = useMemo(
    () => ({
      gameMode,
      myPlayer,
      winner,
      gameState,
      winCount,
      currentTurn,
      setGameMode,
      setMyPlayer,
      setWinner,
      setGameState,
      setWincount,
      setCurrentTurn,
    }),
    [
      gameMode,
      myPlayer,
      winner,
      gameState,
      winCount,
      currentTurn,
      setGameMode,
      setMyPlayer,
      setWinner,
      setWincount,
      setCurrentTurn,
    ]
  );
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}
