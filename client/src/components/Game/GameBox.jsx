import GameButton from './GameButton';

export default function GameBox({
  player,
  setPlayer,
  winner,
  setWinner,
  gameState,
  setGameState,
  setWincount,
}) {
  function checkWinner(state, curPlayer, row, col) {
    if (state[row].every((cell) => cell === curPlayer)) {
      return true;
    }
    if (state.every((r) => r[col] === curPlayer)) {
      return true;
    }
    if (row === col && state.every((r, idx) => r[idx] === curPlayer)) {
      return true;
    }
    if (row + col === 2 && state.every((r, idx) => r[2 - idx] === curPlayer)) {
      return true;
    }
    return false;
  }

  function handleButtonClick(row, col) {
    if (gameState[row][col] !== null) {
      alert('Invalid Move');
      return;
    }

    if (winner) {
      alert(`Player ${winner} has already won! Start a new game.`);
      return;
    }

    const newGameState = gameState.map((row) => [...row]);
    const curPlayer = player;

    newGameState[row][col] = curPlayer;
    setGameState(newGameState);
    setPlayer(player === 'X' ? 'O' : 'X');

    if (checkWinner(newGameState, curPlayer, row, col)) {
      alert(`Player ${curPlayer} wins!`);
      setWincount((prevCount) => ({
        ...prevCount,
        [curPlayer.toLowerCase()]: prevCount[curPlayer.toLowerCase()] + 1,
      }));
      setWinner(curPlayer);
    } else if (
      newGameState.every((row) => row.every((cell) => cell !== null))
    ) {
      alert("It's a tie!");
      setWincount((prevCount) => ({
        ...prevCount,
        ties: prevCount.ties + 1,
      }));
      setWinner('tie');
    }
  }

  return (
    <div className='w-full max-w-xl aspect-square gap-3 rounded-lg grid grid-cols-3 grid-rows-3'>
      {gameState.map((row, rowIndex) =>
        row.map((state, colIndex) => (
          <GameButton
            key={`${rowIndex}-${colIndex}`}
            state={state}
            delay={(rowIndex * 3 + colIndex) * 0.1}
            onClick={() => handleButtonClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
