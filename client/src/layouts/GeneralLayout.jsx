export default function GeneralLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-grow flex items-center justify-center bg-gray-100 dark:bg-neutral-900'>
        {children}
      </main>
    </div>
  );
}
