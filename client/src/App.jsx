import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GeneralLayout from './layouts/GeneralLayout';

import MatchmakingScreen from './pages/MatchmakingScreen';
import Leaderboard from './pages/Leaderboard';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

import MultiplayerModal from './components/MultiplayerModal';

import LoadingProvider from './Provider/LoadingProvider';
import SocketProvider from './Provider/SocketProvider';
import AuthProvider from './Provider/AuthProvider';
import MessageProvider from './Provider/MessageProvider';
import MyStats from './pages/MyStats';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <SocketProvider>
          <GeneralLayout>
            <MessageProvider>
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
                  <Route path='/my-stats' element={<MyStats />} />
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
