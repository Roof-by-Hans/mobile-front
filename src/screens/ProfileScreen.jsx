import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { Avatar } from '../components';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS } from '../constants/theme';
import { getClientPhotoUrl } from '../utils/helpers';

/**
 * Profile Screen Component
 * Pantalla de perfil del cliente con:
 * - Información del usuario
 * - Edición de datos personales
 * - Cambio de contraseña
 * - Ajustes de la aplicación
 * - Cerrar sesión
 */
const ProfileScreen = () => {
  const { logout } = useAuth();
  const { profile, isLoading, error, refreshProfile, updateProfile, changePassword, updateProfilePhoto, deleteProfilePhoto } = useProfile();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    telefono: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmPassword: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Handle profile photo change
   */
  const handleChangePhoto = () => {
    Alert.alert(
      'Foto de Perfil',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: () => pickImage('camera')
        },
        {
          text: 'Seleccionar de Galería',
          onPress: () => pickImage('gallery')
        },
        ...(profile?.fotoPerfil ? [
          {
            text: 'Eliminar Foto',
            style: 'destructive',
            onPress: handleDeletePhoto
          }
        ] : []),
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  /**
   * Pick image from camera or gallery
   */
  const pickImage = async (source) => {
    try {
      // Request permissions
      let permissionResult;
      
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert('Permiso Denegado', 'Necesitas otorgar permisos para usar esta funcionalidad');
        return;
      }

      // Launch picker
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageData = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          fileName: `profile_${Date.now()}.jpg`
        };

        setIsUpdating(true);
        await updateProfilePhoto(imageData);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo actualizar la foto de perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Delete profile photo
   */
  const handleDeletePhoto = async () => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que deseas eliminar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsUpdating(true);
              await deleteProfilePhoto();
              Alert.alert('Éxito', 'Foto de perfil eliminada');
            } catch (err) {
              Alert.alert('Error', err.message || 'No se pudo eliminar la foto');
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  /**
   * Open edit profile modal
   */
  const handleEditProfile = () => {
    if (profile) {
      setEditForm({
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        telefono: profile.telefono || ''
      });
      setShowEditModal(true);
    }
  };

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);

      // Validate required fields
      if (!editForm.nombre.trim() || !editForm.apellido.trim()) {
        Alert.alert('Error', 'Nombre y apellido son obligatorios');
        return;
      }

      await updateProfile({
        nombre: editForm.nombre.trim(),
        apellido: editForm.apellido.trim(),
        telefono: editForm.telefono.trim()
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setShowEditModal(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Open change password modal
   */
  const handleChangePassword = () => {
    setPasswordForm({
      contrasenaActual: '',
      contrasenaNueva: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  /**
   * Save new password
   */
  const handleSavePassword = async () => {
    try {
      setIsUpdating(true);

      // Validate password fields
      if (!passwordForm.contrasenaActual || !passwordForm.contrasenaNueva || !passwordForm.confirmPassword) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      if (passwordForm.contrasenaNueva !== passwordForm.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      if (passwordForm.contrasenaNueva.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await changePassword(passwordForm.contrasenaActual, passwordForm.contrasenaNueva);

      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      setShowPasswordModal(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render error state
   */
  if (error && !profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={refreshProfile} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header with Avatar */}
        <View style={styles.header}>
          <Avatar
            imageUri={profile?.fotoPerfilUrl || getClientPhotoUrl(profile?.fotoPerfil)}
            name={profile?.nombre}
            size={100}
            editable={true}
            onPress={handleChangePhoto}
            isLoading={isUpdating}
          />
          <Text style={styles.name}>
            {profile?.nombre || ''} {profile?.apellido || ''}
          </Text>
          <Text style={styles.email}>{profile?.email || ''}</Text>
          
          {/* Subscription Badge */}
          {profile?.nivelSuscripcion && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>
                {profile.nivelSuscripcion.nombre}
              </Text>
            </View>
          )}
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo Actual</Text>
              <Text style={styles.infoValue}>
                ${profile?.saldoActual?.toFixed(2) || '0.00'}
              </Text>
            </View>
            
            {profile?.tipoSuscripcion && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de Suscripción</Text>
                <Text style={styles.infoValue}>{profile.tipoSuscripcion.tipo}</Text>
              </View>
            )}
            
            {profile?.tarjeta && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado de Tarjeta</Text>
                  <Text style={[
                    styles.infoValue,
                    { color: profile.tarjeta.estado === 'activa' ? COLORS.success : COLORS.warning }
                  ]}>
                    {profile.tarjeta.estado}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Saldo en Tarjeta</Text>
                  <Text style={styles.infoValue}>
                    ${profile.tarjeta.saldoActual?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{profile?.nombre || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Apellido</Text>
              <Text style={styles.infoValue}>{profile?.apellido || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile?.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{profile?.telefono || 'No especificado'}</Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Text style={styles.actionButtonText}>✏️ Editar Datos Personales</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>🔒 Cambiar Contraseña</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowSettingsModal(true)}
          >
            <Text style={styles.actionButtonText}>⚙️ Ajustes de la App</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button 
            title="Cerrar Sesión" 
            onPress={handleLogout} 
            variant="secondary" 
          />
        </View>

      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            
            <Input
              label="Nombre"
              value={editForm.nombre}
              onChangeText={(text) => setEditForm({ ...editForm, nombre: text })}
              placeholder="Ingresa tu nombre"
            />
            
            <Input
              label="Apellido"
              value={editForm.apellido}
              onChangeText={(text) => setEditForm({ ...editForm, apellido: text })}
              placeholder="Ingresa tu apellido"
            />
            
            <Input
              label="Teléfono"
              value={editForm.telefono}
              onChangeText={(text) => setEditForm({ ...editForm, telefono: text })}
              placeholder="Ingresa tu teléfono"
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowEditModal(false)}
                variant="secondary"
                disabled={isUpdating}
                style={styles.modalButton}
              />
              <Button
                title={isUpdating ? "Guardando..." : "Guardar"}
                onPress={handleSaveProfile}
                disabled={isUpdating}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            
            <Input
              label="Contraseña Actual"
              value={passwordForm.contrasenaActual}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, contrasenaActual: text })}
              placeholder="Ingresa tu contraseña actual"
              secureTextEntry
            />
            
            <Input
              label="Nueva Contraseña"
              value={passwordForm.contrasenaNueva}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, contrasenaNueva: text })}
              placeholder="Ingresa tu nueva contraseña"
              secureTextEntry
            />
            
            <Input
              label="Confirmar Contraseña"
              value={passwordForm.confirmPassword}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry
            />
            
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setShowPasswordModal(false)}
                variant="secondary"
                disabled={isUpdating}
                style={styles.modalButton}
              />
              <Button
                title={isUpdating ? "Guardando..." : "Cambiar"}
                onPress={handleSavePassword}
                disabled={isUpdating}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajustes de la App</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notificaciones</Text>
              <Text style={styles.settingValue}>Activadas</Text>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Idioma</Text>
              <Text style={styles.settingValue}>Español</Text>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Tema</Text>
              <Text style={styles.settingValue}>Claro</Text>
            </View>
            
            <Text style={styles.settingNote}>
              * Estas opciones estarán disponibles en una próxima actualización
            </Text>
            
            <View style={styles.modalButtons}>
              <Button
                title="Cerrar"
                onPress={() => setShowSettingsModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

ProfileScreen.propTypes = {};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  subscriptionBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  subscriptionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  logoutSection: {
    padding: 24,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  settingNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;

