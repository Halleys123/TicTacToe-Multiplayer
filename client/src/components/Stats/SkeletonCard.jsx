export default function SkeletonCard() {
  return (
    <div className='bg-neutral-800/50 rounded-xl p-4 border border-neutral-700 animate-pulse'>
      <div className='h-4 bg-neutral-700 rounded w-24 mb-3'></div>
      <div className='h-8 bg-neutral-700 rounded w-16'></div>
    </div>
  );
}
