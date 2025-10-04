import Loader from '../components/Loader';

export default function GeneralLayout({ children }) {
  return (
    <div className='min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black '>
      <Loader />
      {children}
    </div>
  );
}
