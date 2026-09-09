const API_BASE_URL = 'http://localhost:5000/api';

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load dashboard data');
  }

  return data?.data || {};
};
