const API_BASE_URL = 'http://localhost:5000/api';

export const fetchMedicines = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE_URL}/medicines?${searchParams.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load medicines');
  }

  return data?.data || { medicines: [], total: 0, page: 1, limit: 10, totalPages: 1 };
};
