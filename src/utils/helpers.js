/**
 * Common utility functions
 */

/**
 * Validates if a string is a valid email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get the base URL from environment or default
 * @returns {string} Base URL without /api
 */
export const getBaseURL = () => {
  // Remove /api from the end if it exists
  const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Build full URL for client profile photo
 * @param {string} filename - Photo filename or URL
 * @returns {string|null} Full URL or null if no filename
 */
export const getClientPhotoUrl = (filename) => {
  if (!filename) return null;
  
  // If already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Build full URL
  const baseUrl = getBaseURL();
  return `${baseUrl}/uploads/clientes/${filename}`;
};
