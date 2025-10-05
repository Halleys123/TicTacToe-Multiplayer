export default function StatsHeader({ username }) {
  return (
    <div className='text-center p-6 border-b border-neutral-700'>
      <h1 className='text-4xl font-PressStart2P text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2'>
        My Stats
      </h1>
      <p className='text-neutral-400 text-sm'>
        {username || 'Your'} Performance
      </p>
    </div>
  );
}
