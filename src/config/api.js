// frontend/src/config/api.js
// API Configuration for connecting frontend to backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    SESSIONS: `${API_BASE_URL}/auth/sessions`,
    REVOKE_SESSION: (sessionId) => `${API_BASE_URL}/auth/sessions/${sessionId}`,
  },
  
  // Worker
  WORKER: {
    GET_ALL: `${API_BASE_URL}/worker`,
    GET_ONE: (id) => `${API_BASE_URL}/worker/${id}`,
    UPLOAD_PHOTO: `${API_BASE_URL}/worker/upload-photo`,
    GENERATE_CARD: `${API_BASE_URL}/worker/generate-card`,
    UPDATE: (id) => `${API_BASE_URL}/worker/${id}`,
    FLAG: (id) => `${API_BASE_URL}/worker/${id}/flag`,
    ENDORSEMENT: (id) => `${API_BASE_URL}/worker/${id}/endorsement`,
    HISTORY: (id) => `${API_BASE_URL}/worker/${id}/history`,
  },
  
  // Customer
  CUSTOMER: {
    SAVE_PROFILE: `${API_BASE_URL}/customer/save`,
  },
};

// Helper function to make authenticated requests
export const fetchWithAuth = async (url, options = {}) => {
  // Get access token from localStorage
  const accessToken = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  });
  
  // Handle token expiration
  if (response.status === 401) {
    const data = await response.json();
    if (data.code === 'TOKEN_EXPIRED') {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry original request
        return fetchWithAuth(url, options);
      } else {
        // Redirect to login
        window.location.href = '/';
        return null;
      }
    }
  }
  
  return response;
};

// Function to refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// Function to save user data to localStorage
export const saveAuthData = (accessToken, user) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
};

// Function to get user data from localStorage
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// Export API_BASE_URL as default
export default API_BASE_URL;