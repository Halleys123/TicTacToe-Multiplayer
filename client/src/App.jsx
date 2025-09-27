import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GeneralLayout from './layouts/GeneralLayout';

import Leaderboard from './pages/Leaderboard';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GameStateProvider from './Provider/GameStateProvider';
import MatchmakingScreen from './pages/MatchmakingScreen';
import MultiplayerModal from './components/MultiplayerModal';
import AuthProvider from './Provider/AuthProvider';
import LoadingProvider from './Provider/LoadingProvider';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <GameStateProvider>
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
        </GameStateProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
