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
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import { Avatar, Button, Input, Loading, ErrorMessage } from '../components';
import { COLORS } from '../constants/theme';
import { getClientPhotoUrl } from '../utils/helpers';

// Icon Components
const EditIcon = ({ size = 20, color = COLORS.text.secondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = ({ size = 20, color = COLORS.text.secondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect 
      x="3" 
      y="11" 
      width="18" 
      height="11" 
      rx="2" 
      ry="2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M7 11V7a5 5 0 0 1 10 0v4" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const SettingsIcon = ({ size = 20, color = COLORS.text.secondary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path 
      d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

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
        <Loading text="Cargando perfil..." />
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
          <ErrorMessage
            title="Error al cargar perfil"
            message={error}
            variant="error"
            actionText="Reintentar"
            onAction={refreshProfile}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header with Avatar */}
        <View style={styles.header}>
          <Avatar
            imageUri={profile?.fotoPerfilUrl || getClientPhotoUrl(profile?.fotoPerfil)}
            name={profile?.nombre}
            size={120}
            editable={true}
            onPress={handleChangePhoto}
            isLoading={isUpdating}
          />
          <Text style={styles.name}>
            {profile?.nombre || ''} {profile?.apellido || ''}
          </Text>
          <Text style={styles.email}>{profile?.email || ''}</Text>
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DE CUENTA</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo Actual</Text>
              <Text style={styles.infoValue}>
                ${profile?.saldoActual?.toFixed(2) || '0.00'}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            {profile?.tipoSuscripcion && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tipo de Suscripción</Text>
                  <Text style={styles.infoValue}>{profile.tipoSuscripcion.tipo?.toUpperCase()}</Text>
                </View>
                <View style={styles.divider} />
              </>
            )}
            
            {profile?.tarjeta && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado de Tarjeta</Text>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoText}>
                      {profile.tarjeta.estado?.toUpperCase() || 'ACTIVA'}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
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
          <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{profile?.nombre || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Apellido</Text>
              <Text style={styles.infoValue}>{profile?.apellido || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile?.email || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{profile?.telefono || 'No especificado'}</Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <View style={styles.actionLeft}>
              <EditIcon size={20} color={COLORS.text.secondary} />
              <Text style={styles.actionButtonText}>Editar Datos Personales</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <View style={styles.actionLeft}>
              <LockIcon size={20} color={COLORS.text.secondary} />
              <Text style={styles.actionButtonText}>Cambiar Contraseña</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowSettingsModal(true)}
          >
            <View style={styles.actionLeft}>
              <SettingsIcon size={20} color={COLORS.text.secondary} />
              <Text style={styles.actionButtonText}>Ajustes de la App</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEditModal(false)}
        >
          <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            {/* Indicador de arrastre */}
            <View style={styles.modalHandle} />
            
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
        </TouchableOpacity>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPasswordModal(false)}
        >
          <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            {/* Indicador de arrastre */}
            <View style={styles.modalHandle} />
            
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
        </TouchableOpacity>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettingsModal(false)}
        >
          <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalContent}>
            {/* Indicador de arrastre */}
            <View style={styles.modalHandle} />
            
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
        </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.secondary,
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
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  infoCard: {
    backgroundColor: COLORS.background,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  estadoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginTop: 48,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.text.primary,
  },
  actionArrow: {
    fontSize: 24,
    color: COLORS.text.secondary,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 48,
    paddingBottom: 32,
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: COLORS.text.muted,
    borderRadius: 2,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 24,
    marginTop: 12,
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
    color: COLORS.text.primary,
  },
  settingValue: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  settingNote: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;

