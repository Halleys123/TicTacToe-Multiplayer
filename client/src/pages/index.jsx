import { lazy, Suspense } from 'react';

import PageLoader from '../components/PageLoader';

const MatchmakingScreen = lazy(() => import('./MatchmakingScreen'));
const Leaderboard = lazy(() => import('./Leaderboard'));
const HomePage = lazy(() => import('./HomePage'));
const GamePage = lazy(() => import('./GamePage'));
const MyStats = lazy(() => import('./MyStats'));

export function SuspenseLeaderboard() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Leaderboard />
    </Suspense>
  );
}

export function SuspenseMatchmaking() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MatchmakingScreen />
    </Suspense>
  );
}

export function SuspenseHomepage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  );
}

export function SuspenseGamePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GamePage />
    </Suspense>
  );
}

export function SuspenseMyStats() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MyStats />
    </Suspense>
  );
}
