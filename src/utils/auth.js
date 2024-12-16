export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return !!token;
  }
  return false;
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const logout = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Clear local storage first to prevent any subsequent authenticated requests
      localStorage.removeItem('token');
      localStorage.clear();
      
      // Call backend logout endpoint
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Redirect to login page
      window.location.href = '/auth/login';
    }
  }
}; 