const API_BASE_URL = 'http://localhost:5000/api';

export const predictSales = async (month) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ month }),
  });
  
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  
  return response.json();
};

export const getAvailableMonths = async () => {
  const response = await fetch(`${API_BASE_URL}/months`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch available months');
  }
  
  return response.json();
};