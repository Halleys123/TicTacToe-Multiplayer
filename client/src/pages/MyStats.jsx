import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import useMessage from '../hooks/useMessage';
import useLoading from '../hooks/useLoading';
import StatsHeader from '../components/Stats/StatsHeader';
import LoadingSkeleton from '../components/Stats/LoadingSkeleton';
import EmptyState from '../components/Stats/EmptyState';
import StatsGrid from '../components/Stats/StatsGrid';
import TiesCard from '../components/Stats/TiesCard';
import PerformanceBreakdown from '../components/Stats/PerformanceBreakdown';

export default function MyStats() {
  const navigate = useNavigate();
  const { addMessage } = useMessage();
  const { loading, setLoading } = useLoading();

  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  });

  useEffect(() => {
    document.title = 'My Stats - Tic Tac Toe';
    setLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/user/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          addMessage('Failed to fetch user stats', false);
        }
        return response.json();
      })
      .then((data) => {
        addMessage(data.message, data.success);
        if (data.success)
          setStats({
            gamesPlayed: data.data.total,
            ties: data.data.ties,
            wins: data.data.wins,
            losses: data.data.losses,
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const calculateWinRate = () => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.wins / stats.gamesPlayed) * 100);
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-800 max-w-3xl w-full rounded-3xl shadow-2xl border border-neutral-700'
      >
        <StatsHeader username={localStorage.getItem('user_name')} />

        <div className='p-6'>
          {import.meta.env.VITE_NODE_ENV === 'development' && (
            <span className='text-neutral-500 text-xs'>dev mode</span>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : stats.gamesPlayed === 0 ? (
            <EmptyState />
          ) : (
            <>
              <StatsGrid stats={stats} calculateWinRate={calculateWinRate} />
              <div className='mt-6 space-y-6'>
                <TiesCard ties={stats.ties} />
                <PerformanceBreakdown stats={stats} />
              </div>
            </>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition'
        onClick={() => navigate(-1)}
      >
        Go Back
      </motion.button>
    </div>
  );
}
