import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as tokenStorage from '../utils/tokenStorage';
import { API_URL, API_TIMEOUT } from '@env';

/**
 * Sistema de notificación para eventos de autenticación
 * Permite que el AuthContext sea notificado cuando el token expira
 */
let onTokenExpiredListener = null;

/**
 * Registrar un listener para eventos de token expirado
 * @param {Function} callback - Función a ejecutar cuando el token expire
 */
export const setOnTokenExpiredListener = (callback) => {
  onTokenExpiredListener = callback;
};

/**
 * Notificar que el token ha expirado
 */
const notifyTokenExpired = () => {
  if (onTokenExpiredListener) {
    onTokenExpiredListener();
  }
};

/**
 * Axios instance configured for API requests
 * Base URL: http://localhost:3000/api (configurable via .env)
 * Incluye interceptores para manejo de tokens y reintentos automáticos
 */
const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:3000/api',
  timeout: parseInt(API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar reintentos automáticos para peticiones fallidas
axiosRetry(apiClient, {
  retries: 3, // Número de reintentos
  retryDelay: axiosRetry.exponentialDelay, // Delay exponencial entre reintentos
  retryCondition: (error) => {
    // Reintentar solo en errores de red o 5xx
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           (error.response?.status >= 500 && error.response?.status < 600);
  },
});

/**
 * Request interceptor
 * Inyecta token de autenticación desde SecureStore en cada petición
 * EXCEPTO cuando se especifica skipAuthToken: true en la config
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Si la petición tiene skipAuthToken: true, no agregar el token
      if (config.skipAuthToken) {
        return config;
      }
      
      const token = await tokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error recuperando token para request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Maneja errores comunes y expulsión automática en 401 Unauthorized
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      console.error('API Error:', status, data);

      // Handle 401 Unauthorized - Token expirado o inválido
      // EXCEPTO cuando la petición tiene skipAuthToken (e.g., registro público)
      if (status === 401 && !originalRequest._retry && !originalRequest.skipAuthToken) {
        if (isRefreshing) {
          // Si ya se está refrescando, encolar la petición
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Nota: El backend actual no tiene endpoint de refresh token
        // Por ahora, solo limpiamos la sesión y forzamos re-login
        try {
          await tokenStorage.clearAuth();
          processQueue(new Error('Sesión expirada'), null);
          
          // Notificar al AuthContext que el token ha expirado
          notifyTokenExpired();
          
          return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Acceso denegado: permisos insuficientes');
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('Recurso no encontrado');
      }

      // Handle 500+ Server Errors
      if (status >= 500) {
        console.error('Error del servidor. Intenta nuevamente más tarde.');
      }
    } else if (error.request) {
      // No response received - Error de red
      console.error('Network Error:', error.message);
      console.error('Verifica tu conexión a internet y que el servidor esté activo');
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Set authentication token in SecureStore and Axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = async (token) => {
  try {
    await tokenStorage.saveToken(token);
    // También agregar a headers por defecto
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Remove authentication token from SecureStore and Axios headers
 */
export const removeAuthToken = async () => {
  try {
    await tokenStorage.clearAuth();
    // Remover de headers por defecto
    delete apiClient.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Get authentication token from SecureStore
 * @returns {Promise<string|null>}
 */
export const getAuthToken = async () => {
  try {
    return await tokenStorage.getToken();
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Test API connection
 * Verifica que la API esté disponible y respondiendo
 * @returns {Promise<{connected: boolean, message: string, baseURL: string}>}
 */
export const testConnection = async () => {
  try {
    const baseURL = apiClient.defaults.baseURL;
    console.log('🔍 Intentando conectar a:', baseURL);
    
    // Intenta hacer una petición simple a la raíz de la API
    // Puedes cambiar '/health' por cualquier endpoint público que tengas
    const response = await apiClient.get('file-upload-info');
    
    console.log('✅ API conectada exitosamente');
    console.log('📡 Respuesta:', response.data);
    
    return {
      connected: true,
      message: 'Conexión exitosa',
      baseURL: baseURL,
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Error desconocido';
    
    if (error.response) {
      // El servidor respondió con un código de error
      errorMessage = `Servidor respondió con error ${error.response.status}`;
      console.error('❌ Error del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage = 'No se recibió respuesta del servidor. Verifica la URL y que el servidor esté ejecutándose.';
      console.error('❌ Sin respuesta del servidor:', error.message);
    } else {
      // Error al configurar la petición
      errorMessage = error.message;
      console.error('❌ Error en la petición:', error.message);
    }
    
    console.error('🔧 URL configurada:', apiClient.defaults.baseURL);
    console.error('💡 Tip: Si usas localhost, reemplázalo por la IP de tu PC en la red local');
    
    return {
      connected: false,
      message: errorMessage,
      baseURL: apiClient.defaults.baseURL
    };
  }
};

export default apiClient;
