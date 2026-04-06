import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Button, Input, ErrorMessage } from '../components';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

/**
 * Forgot Password Screen
 * Solicita email para enviar enlace de recuperacion
 */
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [requestError, setRequestError] = useState('');
  const { forgotPassword, isLoading } = useAuth();

  /**
   * @param {string} currentEmail
   * @returns {boolean}
   */
  const validateEmail = (currentEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(currentEmail);
  };

  /**
   * @param {any} error
   * @returns {string}
   */
  const getForgotErrorMessage = (error) => {
    const status = error?.response?.status;
    if (status === 400) return 'Ingresa un email valido.';
    if (status >= 500) return 'Tuvimos un problema. Intenta nuevamente.';
    return error?.response?.data?.message || 'No pudimos procesar la solicitud.';
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('El email es requerido');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('El email no es valido');
      return;
    }

    setEmailError('');
  };

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setEmailError('El email es requerido');
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setEmailError('El email no es valido');
      return;
    }

    try {
      setRequestError('');
      await forgotPassword(normalizedEmail);

      Alert.alert(
        'Revisa tu correo',
        'Si el email existe, te enviamos instrucciones para recuperar tu contraseña.',
        [
          {
            text: 'Volver a login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      setRequestError(getForgotErrorMessage(error));
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
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
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/hans-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </Text>

              {requestError ? (
                <ErrorMessage message={requestError} variant="error" style={styles.errorMessage} />
              ) : null}

              <Input
                placeholder="Correo electronico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                  if (requestError) setRequestError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                error={emailError}
                onBlur={handleEmailBlur}
              />

              <View style={styles.buttonsContainer}>
                <Button
                  title="Enviar enlace"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                />

                <View style={styles.loginLinkContainer}>
                  <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
                  <TouchableOpacity onPress={goToLogin} disabled={isLoading}>
                    <Text style={styles.loginLink}>Inicia sesion</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

ForgotPasswordScreen.propTypes = {
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
    paddingTop: 40,
    paddingBottom: SPACING.xl,
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.regular,
  },
  loginLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default ForgotPasswordScreen;
