import { motion } from 'motion/react';

export default function EmptyState() {
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='text-center text-neutral-500 py-12'
    >
      <span className='font-PressStart2P text-lg'>No games yet</span>
      <p className='text-sm mt-2'>Play some games to see your stats!</p>
    </MotionDiv>
  );
}
