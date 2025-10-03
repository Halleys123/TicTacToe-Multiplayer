import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GeneralLayout from './layouts/GeneralLayout';

import MatchmakingScreen from './pages/MatchmakingScreen';
import Leaderboard from './pages/Leaderboard';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

import MultiplayerModal from './components/MultiplayerModal';

import GameStateProvider from './Provider/GameStateProvider';
import LoadingProvider from './Provider/LoadingProvider';
import SocketProvider from './Provider/SocketProvider';
import AuthProvider from './Provider/AuthProvider';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <GameStateProvider>
          <SocketProvider>
            <GeneralLayout>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<HomePage />}>
                    <Route
                      path='multiplayer-options'
                      element={<MultiplayerModal />}
                    />
                  </Route>
                  <Route path='/leaderboard' element={<Leaderboard />} />
                  <Route path='/game' element={<GamePage />} />
                  <Route path='/matchmaking' element={<MatchmakingScreen />} />
                  <Route path='/enter-code' element={<MatchmakingScreen />} />
                </Routes>
              </BrowserRouter>
            </GeneralLayout>
          </SocketProvider>
        </GameStateProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
