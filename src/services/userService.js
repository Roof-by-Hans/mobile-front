import apiClient from './apiClient';

/**
 * User Service
 * Handles client-related API calls for authenticated clients
 * All endpoints require authentication token
 */

/**
 * Get authenticated client profile
 * Response: { 
 *   id, nombre, apellido, email, telefono, fotoPerfil, saldoActual,
 *   nivelSuscripcion: { id, nombre },
 *   tipoSuscripcion: { id, tipo },
 *   tarjeta: { id, uuid, saldoActual, estado, fechaCreacion }
 * }
 * @returns {Promise<Object>} Client profile data
 */
export const getClientProfile = async () => {
  try {
    const response = await apiClient.get('/auth-cliente/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching client profile:', error);
    throw error;
  }
};

/**
 * Get account summary for the authenticated client
 * Response: { saldoActual, totalConsumos, totalPagos, ultimoMovimiento, ... }
 * @returns {Promise<Object>} Account summary
 */
export const getAccountSummary = async () => {
  try {
    const response = await apiClient.get('/auth-cliente/resumen');
    return response.data;
  } catch (error) {
    console.error('Error fetching account summary:', error);
    throw error;
  }
};

/**
 * Get client transaction history
 * @param {Object} params - Query parameters (fecha_inicio, fecha_fin, tipo, page, limit)
 * @returns {Promise<Object>} Response: { movimientos: [], total, page, limit }
 */
export const getClientMovements = async (params = {}) => {
  try {
    const response = await apiClient.get('/auth-cliente/movimientos', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching client movements:', error);
    throw error;
  }
};

/**
 * Get client invoices
 * @param {Object} params - Query parameters (estado, fecha_inicio, fecha_fin, page, limit)
 * @returns {Promise<Object>} Response: { facturas: [], total, page, limit }
 */
export const getClientInvoices = async (params = {}) => {
  try {
    const response = await apiClient.get('/auth-cliente/facturas', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    throw error;
  }
};

/**
 * Update authenticated client profile (self-update)
 * PUT /api/auth-cliente/me
 * @param {Object} clientData - Updated client data (nombre, apellido, telefono, preferencias)
 * @returns {Promise<Object>} Response: { success, message, data: { id, nombre, apellido, email, telefono, fotoPerfil, preferencias } }
 */
export const updateClientProfile = async (clientData) => {
  try {
    const response = await apiClient.put('/auth-cliente/me', clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating client profile:', error);
    throw error;
  }
};

/**
 * Change client password
 * PUT /api/auth-cliente/contrasena
 * @param {Object} passwordData - { contrasenaActual, contrasenaNueva }
 * @returns {Promise<Object>} Response: { success, message }
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth-cliente/contrasena', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Update client profile photo
 * PUT /api/auth-cliente/foto
 * @param {FormData} formData - Form data with photo file
 * @returns {Promise<Object>} Response: { success, message, data: { fotoPerfil } }
 */
export const updateProfilePhoto = async (formData) => {
  try {
    const response = await apiClient.put('/auth-cliente/foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile photo:', error);
    throw error;
  }
};

/**
 * Delete client profile photo
 * DELETE /api/auth-cliente/foto
 * @returns {Promise<Object>} Response: { success, message }
 */
export const deleteProfilePhoto = async () => {
  try {
    const response = await apiClient.delete('/auth-cliente/foto');
    return response.data;
  } catch (error) {
    console.error('Error deleting profile photo:', error);
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
