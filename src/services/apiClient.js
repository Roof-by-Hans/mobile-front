import axios from 'axios';
import { API_URL, API_TIMEOUT } from '@env';

/**
 * Axios instance configured for API requests
 * Base URL and timeout are configured via environment variables
 */
const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:3000/api',
  timeout: parseInt(API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Add authentication token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token from storage
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle common error responses
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.message);
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
