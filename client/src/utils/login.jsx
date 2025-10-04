export default async function login(token, setIsLoggedIn, setLoading) {
  setLoading(true);
  try {
    if (import.meta.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      }
    );
    const data = await response.json();

    setLoading(false);

    if (data.success) {
      console.log('Login successful:', data);
      localStorage.setItem('access_token', data.data.token);
      localStorage.setItem('user_name', data.data.displayName);
      localStorage.setItem('user_email', data.data.email);
      localStorage.setItem('user_id', data.data._id);
      setIsLoggedIn(true);
    } else {
      console.error('Login failed:', data);
      setIsLoggedIn(false);
    }
  } catch (error) {
    console.error('Login error:', error);
    setIsLoggedIn(false);
    setLoading(false);
  }
}
