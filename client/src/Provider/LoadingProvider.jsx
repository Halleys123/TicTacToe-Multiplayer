import { useState } from 'react';
import LoadingContext from '../context/LoadingContext.jsx';

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
