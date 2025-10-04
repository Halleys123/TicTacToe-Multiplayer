import { useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import login from '../utils/login';
import useLoading from '../hooks/useLoading';

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const google_token = localStorage.getItem('google_token');
    if (google_token) {
      login(google_token, setIsLoggedIn, setLoading);
    }
  }, [setLoading]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
