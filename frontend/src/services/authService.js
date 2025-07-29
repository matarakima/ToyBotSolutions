// Servicio de autenticación para ToyBotSolutions frontend

export async function login(username, password) {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.success && data.token) {
    // Guarda el token en localStorage
    localStorage.setItem('jwt', data.token);
    return { success: true, token: data.token };
  } else {
    return { success: false, error: data.message || 'Login failed' };
  }
}

export async function register(username, password) {
  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.success) {
    return { success: true };
  } else {
    return { success: false, error: data.message || 'Register failed' };
  }
}

export function logout() {
  localStorage.removeItem('jwt');
}

export function getToken() {
  return localStorage.getItem('jwt');
}
