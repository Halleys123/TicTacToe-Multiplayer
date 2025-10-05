import { motion } from 'motion/react';

export default function TiesCard({ ties }) {
  if (ties <= 0) return null;

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className='bg-neutral-800/50 rounded-xl p-4 border border-neutral-700'
    >
      <div className='flex items-center justify-between'>
        <span className='text-neutral-400 text-sm'>Ties</span>
        <span className='text-2xl font-bold text-yellow-400'>{ties}</span>
      </div>
    </MotionDiv>
  );
}
