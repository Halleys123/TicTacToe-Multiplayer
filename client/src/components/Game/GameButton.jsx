const allowedStates = ['', 'X', 'O'];
import { motion } from 'motion/react';

export default function GameButton({
  state = null,
  onClick = () => {},
  delay = 0,
}) {
  if (!allowedStates.includes(state)) {
    throw new Error('Invalid state for GameButton');
  }

  const getButtonClasses = () => {
    let baseClasses =
      'game-button w-full h-full rounded-lg flex items-center justify-center text-6xl font-PressStart2P font-bold select-none';

    if (state === 'X') {
      return `${baseClasses} filled-x cursor-not-allowed`;
    } else if (state === 'O') {
      return `${baseClasses} filled-o cursor-not-allowed`;
    } else {
      return `${baseClasses} cursor-pointer`;
    }
  };

  const getSymbolColor = () => {
    if (state === 'X') return 'text-white drop-shadow-lg';
    if (state === 'O') return 'text-white drop-shadow-lg';
    return '';
  };

  return (
    <motion.button
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.1, delay: delay }}
      onClick={onClick}
      disabled={!!state}
      className={getButtonClasses()}
    >
      {state && (
        <span
          className={`${getSymbolColor()} animate-bounce-in`}
          style={{
            textShadow:
              state === 'X'
                ? '0 0 10px rgba(255, 107, 107, 0.8)'
                : '0 0 10px rgba(78, 205, 196, 0.8)',
          }}
        >
          {state}
        </span>
      )}
    </motion.button>
  );
}
