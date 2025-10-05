import SkeletonCard from './SkeletonCard';

export default function LoadingSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-4'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className='bg-neutral-800/50 rounded-xl p-4 border border-neutral-700 animate-pulse'>
        <div className='h-4 bg-neutral-700 rounded w-32 mb-3'></div>
        <div className='h-8 bg-neutral-700 rounded w-full'></div>
      </div>
    </div>
  );
}
