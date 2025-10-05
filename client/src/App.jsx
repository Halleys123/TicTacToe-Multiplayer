import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import GeneralLayout from './layouts/GeneralLayout';
import PageLoader from './components/PageLoader';

const MatchmakingScreen = lazy(() => import('./pages/MatchmakingScreen'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const HomePage = lazy(() => import('./pages/HomePage'));
const GamePage = lazy(() => import('./pages/GamePage'));
const MyStats = lazy(() => import('./pages/MyStats'));

import MultiplayerModal from './components/MultiplayerModal';

import LoadingProvider from './Provider/LoadingProvider';
import SocketProvider from './Provider/SocketProvider';
import AuthProvider from './Provider/AuthProvider';
import MessageProvider from './Provider/MessageProvider';

function SuspenseLeaderboard() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Leaderboard />
    </Suspense>
  );
}

function SuspenseMatchmaking() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MatchmakingScreen />
    </Suspense>
  );
}

function SuspenseHomepage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  );
}

function SuspenseGamePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GamePage />
    </Suspense>
  );
}

function SuspenseMyStats() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MyStats />
    </Suspense>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <SocketProvider>
          <GeneralLayout>
            <MessageProvider>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<SuspenseHomepage />}>
                    <Route
                      path='multiplayer-options'
                      element={<MultiplayerModal />}
                    />
                  </Route>
                  <Route
                    path='/leaderboard'
                    element={<SuspenseLeaderboard />}
                  />
                  <Route path='/game' element={<SuspenseGamePage />} />
                  <Route
                    path='/matchmaking'
                    element={<SuspenseMatchmaking />}
                  />
                  <Route path='/enter-code' element={<SuspenseMatchmaking />} />
                  <Route path='/my-stats' element={<SuspenseMyStats />} />
                </Routes>
              </BrowserRouter>
            </MessageProvider>
          </GeneralLayout>
        </SocketProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
