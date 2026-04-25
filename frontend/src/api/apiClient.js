import axios from 'axios';

/**
 * Base Axios instance for all API calls.
 * Configures the baseURL and default headers.
 */
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8070') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Automatically attaches the JWT token from localStorage to every request's 
 * Authorization header if it exists.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * Handles global API response errors.
 * Specifically checks for 401 (Unauthorized) status to clear invalid tokens.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
