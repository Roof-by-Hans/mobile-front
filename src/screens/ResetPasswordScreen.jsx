import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Button, Input, ErrorMessage } from '../components';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reset Password Screen
 * Restablece contrasena con token recibido por deep link o ingreso manual.
 */
const ResetPasswordScreen = ({ navigation, route }) => {
  const recoveryToken = useMemo(() => route?.params?.token || '', [route?.params?.token]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
  const [requestError, setRequestError] = useState('');
  const { resetPassword, isLoading } = useAuth();

  /**
   * Muestra alertas nativas en mobile y alertas web en navegador.
   * @param {string} title
   * @param {string} message
   */
  const showPlatformAlert = (title, message) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.alert === 'function') {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  };

  /**
   * En web intenta cerrar la pestana luego de confirmar, y si no se puede redirige a login.
   * En mobile navega directo al login.
   */
  const finishResetFlow = () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      redirectToLogin();
      return;
    }

    const confirmMessage = 'Contrasena restablecida correctamente. Presiona Aceptar para finalizar.';
    window.alert(confirmMessage);

    // Solo funciona cuando la pestana fue abierta por script; si falla redirigimos al login.
    window.close();

    setTimeout(() => {
      if (!window.closed) {
        redirectToLogin();
      }
    }, 100);
  };

  /**
   * Redirige al login sin dejar pantallas anteriores en el stack cuando es posible.
   */
  const redirectToLogin = () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login', params: { passwordResetSuccess: true } }],
      });
    } catch (error) {
      navigation.navigate('Login', { passwordResetSuccess: true });
    }
  };

  /**
   * @param {string} currentPassword
   * @returns {boolean}
   */
  const validatePassword = (currentPassword) => currentPassword.length >= 6;

  /**
   * @param {any} error
   * @returns {string}
   */
  const getResetErrorMessage = (error) => {
    const status = error?.response?.status;
    if (status === 400) return 'La contraseña debe tener al menos 6 caracteres.';
    if (status === 401) return 'El enlace expiro. Solicita uno nuevo.';
    if (status >= 500) return 'Tuvimos un problema. Intenta nuevamente.';
    return error?.response?.data?.message || 'No pudimos restablecer tu contraseña.';
  };

  const handleSubmit = async () => {
    const newErrors = { password: '', confirmPassword: '' };

    if (!recoveryToken) {
      const invalidTokenMessage = 'El enlace no contiene un token valido. Vuelve a abrir el enlace desde tu correo.';
      setRequestError(invalidTokenMessage);
      showPlatformAlert('Enlace invalido', invalidTokenMessage);
      navigation.navigate('Login');
      return;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    if (newErrors.password || newErrors.confirmPassword) {
      return;
    }

    try {
      setRequestError('');
      await resetPassword(recoveryToken, password);
      finishResetFlow();
    } catch (error) {
      const status = error?.response?.status;
      const message = getResetErrorMessage(error);
      setRequestError(message);

      if (status === 401) {
        showPlatformAlert('Enlace expirado', message);
        navigation.navigate('Login');
        return;
      }

      showPlatformAlert('No se pudo restablecer', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/hans-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Nueva contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa el token que recibiste y define una nueva contraseña para tu cuenta.
            </Text>

            {requestError ? (
              <ErrorMessage message={requestError} variant="error" style={styles.errorMessage} />
            ) : null}

            <Input
              placeholder="Nueva contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                if (requestError) setRequestError('');
              }}
              secureTextEntry
              editable={!isLoading}
              error={errors.password}
            />

            <Input
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
                if (requestError) setRequestError('');
              }}
              secureTextEntry
              editable={!isLoading}
              error={errors.confirmPassword}
            />

            <View style={styles.buttonsContainer}>
              <Button
                title="Guardar nueva contraseña"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading || !recoveryToken}
              />

              <View style={styles.linksContainer}>
                {!recoveryToken ? (
                  <Text style={styles.linkHelperText}>
                    Abre el enlace de recuperacion desde tu correo para continuar.
                  </Text>
                ) : null}
                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                  <Text style={styles.secondaryLink}>Volver a login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

ResetPasswordScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string,
    }),
  }),
};

ResetPasswordScreen.defaultProps = {
  route: undefined,
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
  logo: {
    width: 150,
    height: 150,
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
    marginBottom: SPACING.xl,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 22,
  },
  errorMessage: {
    marginBottom: SPACING.md,
  },
  buttonsContainer: {
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  linksContainer: {
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  linkHelperText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  secondaryLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default ResetPasswordScreen;
