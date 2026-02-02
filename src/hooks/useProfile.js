import { useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';

/**
 * Custom Hook for Client Profile Management
 * Handles fetching and updating client profile data
 * 
 * @returns {Object} Profile state and actions
 * @property {Object|null} profile - Client profile data
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message if any
 * @property {Function} refreshProfile - Function to refresh profile data
 * @property {Function} updateProfile - Function to update profile data
 * @property {Function} changePassword - Function to change password
 */
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch client profile from API
   * Response: { 
   *   success, 
   *   data: { 
   *     id, nombre, apellido, email, telefono, fotoPerfil, saldoActual,
   *     nivelSuscripcion, tipoSuscripcion, tarjeta 
   *   } 
   * }
   */
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userService.getClientProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || 'Error al obtener perfil');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al cargar perfil';
      console.error('Error fetching profile:', errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh profile data
   */
  const refreshProfile = useCallback(() => {
    return fetchProfile();
  }, [fetchProfile]);

  /**
   * Update client profile
   * @param {Object} updatedData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  const updateProfile = useCallback(async (updatedData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.updateClientProfile(updatedData);
      
      if (response.success && response.data) {
        setProfile(response.data);
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar perfil');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar perfil';
      console.error('Error updating profile:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Change client password
   * @param {string} contrasenaActual - Current password
   * @param {string} contrasenaNueva - New password
   * @returns {Promise<Object>} Response
   */
  const changePassword = useCallback(async (contrasenaActual, contrasenaNueva) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.changePassword({
        contrasenaActual,
        contrasenaNueva
      });

      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Error al cambiar contraseña');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al cambiar contraseña';
      console.error('Error changing password:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update profile photo
   * @param {Object} imageData - Image file data from picker
   * @returns {Promise<Object>} Response
   */
  const updateProfilePhoto = useCallback(async (imageData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('foto', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.fileName || 'profile.jpg',
      });

      const response = await userService.updateProfilePhoto(formData);

      if (response.success && response.data) {
        // Update profile with new photo URL
        setProfile(prev => ({
          ...prev,
          fotoPerfil: response.data.fotoPerfil,
          fotoPerfilUrl: response.data.fotoPerfilUrl
        }));
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar foto');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar foto';
      console.error('Error updating profile photo:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete profile photo
   * @returns {Promise<Object>} Response
   */
  const deleteProfilePhoto = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.deleteProfilePhoto();

      if (response.success) {
        // Remove photo from profile
        setProfile(prev => ({
          ...prev,
          fotoPerfil: null,
          fotoPerfilUrl: null
        }));
        return response;
      } else {
        throw new Error(response.message || 'Error al eliminar foto');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar foto';
      console.error('Error deleting profile photo:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
    changePassword,
    updateProfilePhoto,
    deleteProfilePhoto
  };
};

export default useProfile;
