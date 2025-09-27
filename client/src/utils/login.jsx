export default async function login(token, setIsLoggedIn) {
  const response = await fetch('http://localhost:5173/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();

  if (data.success) {
    console.log('Login successful:', data);
    setIsLoggedIn(true);
  } else {
    console.error('Login failed:', data);
    setIsLoggedIn(false);
  }
}
