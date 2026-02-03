import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { Button, Input, ErrorMessage } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Login Screen Component
 * Handles user authentication with email/password validation
 * Integrado con backend en http://localhost:3000/api/auth-cliente/login
 */
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login, isLoading, error: authError } = useAuth();

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
   * Validate password
   * @param {string} password - Password to validate
   * @returns {boolean} - True if valid
   */
  const validatePassword = (password) => {
    return password.length >= 4;
  };

  /**
   * Handle email blur - validate email
   */
  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'El email no es válido' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  /**
   * Handle password blur - validate password
   */
  const handlePasswordBlur = () => {
    if (password && !validatePassword(password)) {
      setErrors((prev) => ({ ...prev, password: 'La contraseña debe tener al menos 4 caracteres' }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    // Validate all fields
    const newErrors = { email: '', password: '' };
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      // Integrado con backend: POST /api/auth-cliente/login
      // Request: { email, contrasena }
      // Response: { success, message, data: { token, cliente } }
      await login(email, password);
    } catch (error) {
      // El error ya se maneja en el contexto AuthContext
      console.error('Error en login:', error);
    }
  };

  /**
   * Navigate to register screen
   */
  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.content}>
        {/* Logo placeholder - Can be replaced with actual image */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Inicia sesión para acceder a tu cuenta</Text>

          {authError && (
            <ErrorMessage
              message={authError}
              variant="error"
              style={styles.errorMessage}
            />
          )}

          <View style={styles.inputsContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
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
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.buttonsContainer}>
              <Button title="Iniciar sesión" onPress={handleLogin} />
              <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={goToRegister}>
                  <Text style={styles.registerLink}>Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

LoginScreen.propTypes = {
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    fontWeight: FONT_WEIGHTS.regular,
  },
  errorMessage: {
    marginBottom: SPACING.md,
  },
  inputsContainer: {
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  loadingContainer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  buttonsContainer: {
    gap: SPACING.md,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  registerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.regular,
  },
  registerLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default LoginScreen;
