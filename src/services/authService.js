import apiClient, { setAuthToken, removeAuthToken } from './apiClient';
import * as tokenStorage from '../utils/tokenStorage';

/**
 * Auth Service
 * Handles authentication-related API calls
 * Integrado con el backend en http://localhost:3000/api
 */

/**
 * Login de cliente (app móvil)
 * @param {string} email - Email del cliente
 * @param {string} contrasena - Contraseña del cliente
 * @returns {Promise<Object>} Response: { success, message, data: { token, cliente: { id, email, activo, roles } } }
 */
export const login = async (email, contrasena) => {
  try {
    // Endpoint: POST /api/auth-cliente/login
    const response = await apiClient.post('/auth-cliente/login', { 
      email, 
      contrasena 
    });
    
    const { success, data } = response.data;
    
    if (success && data?.token) {
      // Guardar token y datos del cliente en SecureStore
      await tokenStorage.saveToken(data.token);
      await tokenStorage.saveClientData(data.cliente);
      await setAuthToken(data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Registro de nuevo cliente
 * @param {Object} clienteData - Datos de registro del cliente
 * @param {string} clienteData.nombre - Nombre del cliente
 * @param {string} clienteData.apellido - Apellido del cliente
 * @param {string} clienteData.email - Email del cliente
 * @param {string} clienteData.contrasena - Contraseña del cliente
 * @param {string} [clienteData.telefono] - Teléfono opcional
 * @returns {Promise<Object>} Response: { success, message, data: { token, cliente } }
 */
export const register = async (clienteData) => {
  try {
    // Endpoint: POST /api/auth-cliente/registro (application/json)
    // Este endpoint es público y retorna el token JWT directamente
    const response = await apiClient.post('/auth-cliente/registro', {
      nombre: clienteData.nombre,
      apellido: clienteData.apellido,
      email: clienteData.email,
      contrasena: clienteData.contrasena,
      telefono: clienteData.telefono || undefined, // Solo enviar si existe
    }, {
      skipAuthToken: true, // Flag personalizado para omitir el token (público)
    });
    
    const { success, data } = response.data;
    
    if (success && data?.token) {
      // Guardar token y datos del cliente en SecureStore
      await tokenStorage.saveToken(data.token);
      await tokenStorage.saveClientData(data.cliente);
      await setAuthToken(data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cerrar sesión del cliente
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Limpiar tokens y datos de usuario del almacenamiento seguro
    await tokenStorage.clearAuth();
    await removeAuthToken();
  } catch (error) {
    console.error('Error en logout:', error);
    // Asegurar limpieza incluso si hay error
    await tokenStorage.clearAuth();
    await removeAuthToken();
    throw error;
  }
};

/**
 * Obtener perfil del cliente actual desde almacenamiento local
 * @returns {Promise<Object|null>} Datos del cliente o null
 */
export const getCurrentClient = async () => {
  try {
    const clienteData = await tokenStorage.getClientData();
    return clienteData;
  } catch (error) {
    console.error('Error al obtener cliente actual:', error);
    return null;
  }
};

/**
 * Verificar si el cliente tiene una sesión válida guardada
 * @returns {Promise<boolean>}
 */
export const hasValidSession = async () => {
  try {
    return await tokenStorage.hasStoredSession();
  } catch (error) {
    return false;
  }
};

/**
 * Restaurar sesión del cliente desde almacenamiento seguro
 * @returns {Promise<Object|null>} Returns { token, clienteData } or null
 */
export const restoreSession = async () => {
  try {
    const token = await tokenStorage.getToken();
    const clienteData = await tokenStorage.getClientData();
    
    if (token && clienteData) {
      await setAuthToken(token);
      return { token, clienteData };
    }
    
    return null;
  } catch (error) {
    console.error('Error al restaurar sesión:', error);
    return null;
  }
};
