export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // Only set Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  config.method = (options.method || 'GET').toUpperCase();

  if (['POST', 'PUT', 'PATCH'].includes(config.method) && options.body) {
    // Don't stringify if it's FormData
    if (!(options.body instanceof FormData)) {
      config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }
  }

  try {
    console.log('Making request:', { url, config });
    const response = await fetch(url, config);

    if (response.status === 401) {
      window.location.href = '/auth/login';
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}; 