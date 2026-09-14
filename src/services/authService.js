const API_BASE_URL = 'http://localhost:5000/api';

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.data?.user || null;
};

export const loginUser = async ({ username, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  return data;
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Logout failed');
  }

  return data;
};
