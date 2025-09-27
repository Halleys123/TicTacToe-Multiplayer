import { useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import login from '../utils/login';

export default function AuthProvider({ children }) {
  const [loggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const google_token = localStorage.getItem('google_token');
    if (google_token) {
      login(google_token, setIsLoggedIn);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
