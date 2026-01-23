import apiClient from './apiClient';

/**
 * User Service
 * Handles user-related API calls
 */

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response: { id, name, email, avatar, ... }
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Response: { id, name, email, ... }
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response: { message }
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users (with pagination)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Response: { users: [], total, page, limit }
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search users
 * @param {string} query - Search query
 * @returns {Promise<Array>} Response: [{ id, name, email, ... }]
 */
export const searchUsers = async (query) => {
  try {
    const response = await apiClient.get('/users/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
