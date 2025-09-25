import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GeneralLayout from './layouts/GeneralLayout';

import Leaderboard from './pages/Leaderboard';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GameStateProvider from './Provider/GameStateProvider';

function App() {
  return (
    <GameStateProvider>
      <GeneralLayout>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/game' element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </GeneralLayout>
    </GameStateProvider>
  );
}

export default App;
