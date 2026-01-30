import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Register Screen Component
 * Handles new user registration with full validation
 * Campos requeridos por el API: nombre, apellido, email, contrasena
 */
const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading, error: authError } = useAuth();

  /**
   * Validate name
   * @param {string} name - Name to validate
   * @returns {boolean} - True if valid
   */
  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  /**
   * Validate phone (optional)
   * @param {string} phone - Phone to validate
   * @returns {boolean} - True if valid or empty
   */
  const validatePhone = (phone) => {
    if (!phone) return true; // Es opcional
    return phone.trim().length >= 8;
  };

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {boolean} - True if valid
   */
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  /**
   * Handle nombre blur - validate nombre
   */
  const handleNombreBlur = () => {
    if (nombre && !validateName(nombre)) {
      setErrors((prev) => ({ ...prev, nombre: 'El nombre debe tener al menos 2 caracteres' }));
    } else {
      setErrors((prev) => ({ ...prev, nombre: '' }));
    }
  };

  /**
   * Handle apellido blur - validate apellido
   */
  const handleApellidoBlur = () => {
    if (apellido && !validateName(apellido)) {
      setErrors((prev) => ({ ...prev, apellido: 'El apellido debe tener al menos 2 caracteres' }));
    } else {
      setErrors((prev) => ({ ...prev, apellido: '' }));
    }
  };

  /**
   * Handle telefono blur - validate telefono
   */
  const handleTelefonoBlur = () => {
    if (telefono && !validatePhone(telefono)) {
      setErrors((prev) => ({ ...prev, telefono: 'El teléfono debe tener al menos 8 caracteres' }));
    } else {
      setErrors((prev) => ({ ...prev, telefono: '' }));
    }
  };

  /**
   * Handle email blur - validate email
   */
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Email inválido' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  /**
   * Handle password blur - validate password
   */
  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'La contraseña debe tener al menos 6 caracteres',
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  /**
   * Handle confirm password blur - validate match
   */
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  /**
   * Handle registration form submission
   */
  const handleRegister = async () => {
    // Validate all fields
    const newErrors = {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!nombre) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (!validateName(nombre)) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!apellido) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (!validateName(apellido)) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (telefono && !validatePhone(telefono)) {
      newErrors.telefono = 'El teléfono debe tener al menos 8 caracteres';
    }

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    try {
      // Datos del cliente según el API: POST /api/clientes
      // Campos requeridos: nombre, apellido, email, contrasena
      // Campos opcionales: telefono, idTarjeta, preferencias, fotoPerfil
      const userData = {
        nombre,
        apellido,
        email,
        contrasena: password,
      };
      
      // Agregar teléfono solo si está presente
      if (telefono) {
        userData.telefono = telefono;
      }
      
      await register(userData);
      // El AuthContext ya maneja el login automático después del registro exitoso
      // No necesitamos navegar manualmente, el estado isAuthenticated cambiará
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'No se pudo completar el registro';
      Alert.alert('Error de registro', errorMsg);
    }
  };

  /**
   * Navigate back to login screen
   */
  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo placeholder */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Únete a nosotros y crea tu cuenta.</Text>

            <View style={styles.inputsContainer}>
              <Input
                placeholder="Nombre"
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: '' }));
                }}
                editable={!isLoading}
                error={errors.nombre}
                onBlur={handleNombreBlur}
              />

              <Input
                placeholder="Apellido"
                value={apellido}
                onChangeText={(text) => {
                  setApellido(text);
                  if (errors.apellido) setErrors((prev) => ({ ...prev, apellido: '' }));
                }}
                editable={!isLoading}
                error={errors.apellido}
                onBlur={handleApellidoBlur}
              />

              <Input
                placeholder="Teléfono (opcional)"
                value={telefono}
                onChangeText={(text) => {
                  setTelefono(text);
                  if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: '' }));
                }}
                keyboardType="phone-pad"
                editable={!isLoading}
                error={errors.telefono}
                onBlur={handleTelefonoBlur}
              />

              <Input
                placeholder="Correo electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                error={errors.email}
                onBlur={handleEmailBlur}
              />

              <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                secureTextEntry
                editable={!isLoading}
                error={errors.password}
                onBlur={handlePasswordBlur}
              />

              <Input
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                secureTextEntry
                editable={!isLoading}
                error={errors.confirmPassword}
                onBlur={handleConfirmPasswordBlur}
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.text} />
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button title="Crear cuenta" onPress={handleRegister} />
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                  <Text style={styles.loginLink} onPress={goToLogin}>
                    Inicia sesión
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>    </SafeAreaView>  );
};

RegisterScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

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
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoPlaceholder: {
    width: 231,
    height: 206,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
  },
  formContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontWeight: FONT_WEIGHTS.regular,
  },
  inputsContainer: {
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  buttonsContainer: {
    gap: SPACING.md,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.regular,
  },
  loginLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.bold,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
