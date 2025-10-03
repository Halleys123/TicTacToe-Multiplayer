import GameButton from './GameButton';

export default function GameBox({ gameState, handleButtonClick }) {
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
