import apiClient, { setAuthToken, removeAuthToken } from './apiClient';

/**
 * Auth Service
 * Handles authentication-related API calls
 */

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response: { user: { id, name, email }, token }
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data;
    
    if (token) {
      await setAuthToken(token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Response: { user: { id, name, email }, token }
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    const { token } = response.data;
    
    if (token) {
      await setAuthToken(token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
    await removeAuthToken();
  } catch (error) {
    // Even if request fails, remove token locally
    await removeAuthToken();
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Response: { id, name, email, ... }
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} Response: { token }
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    const { token } = response.data;
    
    if (token) {
      await setAuthToken(token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
