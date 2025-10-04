import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  import.meta.env.VITE_NODE_ENV === 'development' ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
);
