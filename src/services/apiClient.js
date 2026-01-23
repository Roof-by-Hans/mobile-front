import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_TIMEOUT } from '@env';

/**
 * Axios instance configured for API requests
 * Base URL and timeout are configured via environment variables
 */
const apiClient = axios.create({
  baseURL: API_URL,
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
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
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
  async (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error('API Error:', status, data);

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        await AsyncStorage.removeItem('authToken');
        // TODO: Navigate to login screen or trigger logout
      }
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

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Get authentication token
 * @returns {Promise<string|null>}
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
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
