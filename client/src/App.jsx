import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GeneralLayout from './layouts/GeneralLayout.jsx';

import MatchmakingScreen from './pages/MatchmakingScreen.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import HomePage from './pages/HomePage.jsx';
import GamePage from './pages/GamePage.jsx';

import MultiplayerModal from './components/MultiplayerModal.jsx';

import LoadingProvider from './Provider/LoadingProvider.jsx';
import SocketProvider from './Provider/SocketProvider.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
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
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
