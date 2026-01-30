/**
 * @fileoverview Servicio de almacenamiento de tokens para CLIENTES
 * Usa AsyncStorage que es multiplataforma (iOS, Android, Web)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const CLIENT_DATA_KEY = '@client_data';

/**
 * Guarda el token de acceso de forma segura
 * @param {string} token - Token JWT de acceso
 * @returns {Promise<void>}
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar token:', error);
    throw error;
  }
};

/**
 * Recupera el token de acceso almacenado
 * @returns {Promise<string|null>} - Token JWT o null si no existe
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error al recuperar token:', error);
    return null;
  }
};

/**
 * Guarda el refresh token de forma segura
 * @param {string} refreshToken - Refresh token JWT
 * @returns {Promise<void>}
 */
export const saveRefreshToken = async (refreshToken) => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error al guardar refresh token:', error);
    throw error;
  }
};

/**
 * Recupera el refresh token almacenado
 * @returns {Promise<string|null>} - Refresh token o null si no existe
 */
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error al recuperar refresh token:', error);
    return null;
  }
};

/**
 * Guarda los datos del cliente de forma segura
 * @param {Object} clienteData - Datos del cliente { id, nombreUsuario, activo, roles }
 * @returns {Promise<void>}
 */
export const saveClientData = async (clienteData) => {
  try {
    await AsyncStorage.setItem(CLIENT_DATA_KEY, JSON.stringify(clienteData));
  } catch (error) {
    console.error('Error al guardar datos del cliente:', error);
    throw error;
  }
};

// Mantener saveUserData por compatibilidad (deprecado)
export const saveUserData = saveClientData;

/**
 * Recupera los datos del cliente almacenados
 * @returns {Promise<Object|null>} - Datos del cliente o null si no existen
 */
export const getClientData = async () => {
  try {
    const data = await AsyncStorage.getItem(CLIENT_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al recuperar datos del cliente:', error);
    return null;
  }
};

// Mantener getUserData por compatibilidad (deprecado)
export const getUserData = getClientData;

/**
 * Elimina todos los tokens y datos del cliente del almacenamiento seguro
 * @returns {Promise<void>}
 */
export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(CLIENT_DATA_KEY);
  } catch (error) {
    console.error('Error al limpiar autenticación:', error);
    throw error;
  }
};

/**
 * Verifica si existe una sesión guardada
 * @returns {Promise<boolean>} - true si hay token guardado
 */
export const hasStoredSession = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    return false;
  }
};
