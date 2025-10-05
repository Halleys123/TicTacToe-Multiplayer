import { motion } from 'motion/react';

export default function PerformanceBreakdown({ stats }) {
  const { wins, losses, ties, gamesPlayed } = stats;
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className='bg-neutral-800/50 rounded-xl p-4 border border-neutral-700'
    >
      <div className='text-neutral-400 text-sm mb-3'>Performance Breakdown</div>
      <div className='flex gap-2 h-8 rounded-lg overflow-hidden'>
        {wins > 0 && (
          <MotionDiv
            initial={{ width: 0 }}
            animate={{
              width: `${(wins / gamesPlayed) * 100}%`,
            }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className='bg-green-600 flex items-center justify-center text-xs text-white font-semibold'
          >
            {wins > 2 && wins}
          </MotionDiv>
        )}
        {losses > 0 && (
          <MotionDiv
            initial={{ width: 0 }}
            animate={{
              width: `${(losses / gamesPlayed) * 100}%`,
            }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className='bg-red-600 flex items-center justify-center text-xs text-white font-semibold'
          >
            {losses > 2 && losses}
          </MotionDiv>
        )}
        {ties > 0 && (
          <MotionDiv
            initial={{ width: 0 }}
            animate={{
              width: `${(ties / gamesPlayed) * 100}%`,
            }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className='bg-yellow-600 flex items-center justify-center text-xs text-white font-semibold'
          >
            {ties > 2 && ties}
          </MotionDiv>
        )}
      </div>
    </MotionDiv>
  );
}
