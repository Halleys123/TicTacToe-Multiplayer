import { motion } from 'motion/react';
import StatCard from './StatCard';

export default function StatsGrid({ stats, calculateWinRate }) {
  const { gamesPlayed, wins, losses } = stats;
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className='space-y-6'
    >
      <div className='grid grid-cols-2 gap-4'>
        <StatCard
          label='Games Played'
          value={gamesPlayed}
          delay={0.1}
          variant='default'
        />
        <StatCard
          label='Win Rate'
          value={`${calculateWinRate()}%`}
          delay={0.2}
          variant='default'
        />
        <StatCard label='Wins' value={wins} delay={0.3} variant='win' />
        <StatCard label='Losses' value={losses} delay={0.4} variant='loss' />
      </div>
    </MotionDiv>
  );
}
