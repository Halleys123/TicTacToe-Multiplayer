import { motion } from 'motion/react';

export default function StatCard({
  label,
  value,
  delay = 0,
  variant = 'default',
}) {
  const variants = {
    default: 'bg-neutral-800/50 border-neutral-700',
    win: 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50',
    loss: 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50',
  };

  const textColors = {
    default: 'text-white',
    win: 'text-green-400',
    loss: 'text-red-400',
  };

  const labelColors = {
    default: 'text-neutral-400',
    win: 'text-green-300/80',
    loss: 'text-red-300/80',
  };

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`${variants[variant]} rounded-xl p-4 border`}
    >
      <div className={`${labelColors[variant]} text-sm mb-2`}>{label}</div>
      <div className={`text-3xl font-bold ${textColors[variant]}`}>{value}</div>
    </MotionDiv>
  );
}
