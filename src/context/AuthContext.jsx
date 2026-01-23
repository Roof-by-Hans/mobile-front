import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages user authentication state across the application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Login function
   * @param {Object} userData - User credentials and data
   * @returns {Promise<void>}
   */
  const login = async (userData) => {
    try {
      setIsLoading(true);
      // TODO: Integrate with backend login API
      // Response: { id, email, name, token }
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * Clears user session and authentication state
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      // TODO: Clear tokens from secure storage
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   * @param {Object} userData - New user registration data
   * @returns {Promise<void>}
   */
  const register = async (userData) => {
    try {
      setIsLoading(true);
      // TODO: Integrate with backend register API
      // Response: { id, email, name, token }
      setUser(userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
