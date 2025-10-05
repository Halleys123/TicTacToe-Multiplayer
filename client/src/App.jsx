import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  SuspenseHomepage,
  SuspenseGamePage,
  SuspenseLeaderboard,
  SuspenseMyStats,
  SuspenseMatchmaking,
} from './pages/index';

import { Providers } from './Provider/index';
import GeneralLayout from './layouts/GeneralLayout';
import MultiplayerModal from './components/MultiplayerModal';

function App() {
  return (
    <Providers>
      <GeneralLayout>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SuspenseHomepage />}>
              <Route
                path='multiplayer-options'
                element={<MultiplayerModal />}
              />
            </Route>
            <Route path='/leaderboard' element={<SuspenseLeaderboard />} />
            <Route path='/game' element={<SuspenseGamePage />} />
            <Route path='/matchmaking' element={<SuspenseMatchmaking />} />
            <Route path='/enter-code' element={<SuspenseMatchmaking />} />
            <Route path='/my-stats' element={<SuspenseMyStats />} />
          </Routes>
        </BrowserRouter>
      </GeneralLayout>
    </Providers>
  );
}

export default App;
