import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GeneralLayout from './layouts/GeneralLayout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <GeneralLayout>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </GeneralLayout>
  );
}

export default App;
