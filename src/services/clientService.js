import apiClient from './apiClient';

/**
 * Cliente Service
 * Gestiona peticiones relacionadas con datos del cliente autenticado
 * Response: Datos desde tabla Clientes (backend)
 */

/**
 * Obtener resumen de cuenta del cliente autenticado
 * Endpoint: GET /api/auth-cliente/resumen
 * @returns {Promise<Object>} Resumen de cuenta del cliente autenticado
 */
export const getResumenCuenta = async () => {
  try {
    const response = await apiClient.get('/auth-cliente/resumen');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo resumen de cuenta:', error);
    throw error;
  }
};

/**
 * Obtener movimientos de cuenta del cliente autenticado (actividad reciente)
 * Endpoint: GET /api/auth-cliente/movimientos
 * @param {number} limit - Límite de resultados (default: 5)
 * @returns {Promise<Array>} Lista de movimientos
 */
export const getMovimientosCuenta = async (limit = 5) => {
  try {
    const response = await apiClient.get('/auth-cliente/movimientos', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo movimientos de cuenta:', error);
    throw error;
  }
};

/**
 * Obtener datos del perfil del cliente autenticado
 * Endpoint: GET /api/auth-cliente/me
 * @returns {Promise<Object>} Datos completos del cliente autenticado
 */
export const getPerfilCliente = async () => {
  try {
    const response = await apiClient.get('/auth-cliente/me');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo perfil del cliente:', error);
    throw error;
  }
};

/**
 * Obtener facturas del cliente autenticado
 * Endpoint: GET /api/auth-cliente/facturas
 * @returns {Promise<Array>} Lista de facturas
 */
export const getFacturasCliente = async () => {
  try {
    const response = await apiClient.get('/auth-cliente/facturas');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo facturas:', error);
    throw error;
  }
};

/**
 * Obtener productos consumidos por el cliente
 * Endpoint: GET /api/facturas/cliente/:idCliente/productos-consumidos
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>} Lista de productos consumidos (registro único por producto)
 */
export const getProductosConsumidos = async (idCliente) => {
  try {
    const response = await apiClient.get(`/facturas/cliente/${idCliente}/productos-consumidos`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo productos consumidos:', error);
    throw error;
  }
};
