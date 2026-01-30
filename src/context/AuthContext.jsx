import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Gestiona el estado de autenticación del CLIENTE con persistencia entre reinicios
 * Integrado con backend en http://localhost:3000/api (tabla: Clientes)
 */
export const AuthProvider = ({ children }) => {
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true inicialmente para restaurar sesión
  const [error, setError] = useState(null);

  /**
   * Restore session on app startup
   * Recupera sesión guardada desde SecureStore
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setIsLoading(true);
        const session = await authService.restoreSession();
        
        if (session?.clienteData) {
          setCliente(session.clienteData);
          console.log('✅ Sesión restaurada:', session.clienteData.email || session.clienteData.nombreUsuario);
        } else {
          console.log('ℹ️ No hay sesión previa guardada');
        }
      } catch (error) {
        console.error('Error restaurando sesión:', error);
        setError('Error al restaurar sesión');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Login del cliente
   * @param {string} email - Email del cliente
   * @param {string} contrasena - Contraseña del cliente
   * @returns {Promise<Object>} Response data
   */
  const login = async (email, contrasena) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Llamar al servicio de autenticación
      // Response: { success, message, data: { token, cliente: { id, email, activo, roles } } }
      const response = await authService.login(email, contrasena);
      
      if (response.success && response.data?.cliente) {
        setCliente(response.data.cliente);
        console.log('✅ Login exitoso:', response.data.cliente.email);
        return response;
      } else {
        throw new Error(response.message || 'Error en login');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      console.error('❌ Login error:', errorMsg);
      setError(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cerrar sesión del cliente
   * Limpia sesión, tokens y estado de autenticación del cliente
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Limpiar tokens del almacenamiento seguro
      await authService.logout();
      setCliente(null);
      
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setError('Error al cerrar sesión');
      // Forzar limpieza incluso si hay error
      setCliente(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registro de nuevo cliente
   * @param {Object} clienteData - Datos de registro del nuevo cliente
   * @param {string} clienteData.nombre - Nombre
   * @param {string} clienteData.apellido - Apellido
   * @param {string} clienteData.email - Email
   * @param {string} clienteData.contrasena - Contraseña
   * @param {string} [clienteData.telefono] - Teléfono opcional
   * @returns {Promise<Object>} Response data
   */
  const register = async (clienteData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Llamar al servicio de registro
      // Response: { success, message, data: { token, cliente } }
      const response = await authService.register(clienteData);
      
      if (response.success && response.data?.cliente) {
        // El registro ya retorna el token y guarda los datos
        // Solo actualizamos el estado del cliente
        setCliente(response.data.cliente);
        console.log('✅ Registro exitoso:', response.data.cliente.email);
        return response;
      } else {
        throw new Error(response.message || 'Error en registro');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al registrarse';
      console.error('❌ Register error:', errorMsg);
      setError(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cliente,
    isLoading,
    isAuthenticated: !!cliente,
    error,
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
