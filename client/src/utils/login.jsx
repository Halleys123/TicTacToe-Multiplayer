export default async function login(token, setIsLoggedIn, setLoading) {
  console.log('Logging in with token:', token);
  console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

  setLoading(true);
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
    setIsLoggedIn(true);
  } else {
    console.error('Login failed:', data);
    setIsLoggedIn(false);
  }
}
