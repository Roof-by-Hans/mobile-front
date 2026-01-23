import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { testConnection } from '../services/apiClient';

/**
 * Home Screen Component
 */
const HomeScreen = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Verifica la conexión con la API
   */
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result);
    } catch (error) {
      console.error('Error al verificar conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica la conexión automáticamente al montar el componente
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Tu aplicación Expo está lista</Text>
      
      {/* Estado de conexión con la API */}
      <View style={styles.connectionContainer}>
        <Text style={styles.sectionTitle}>Estado de la API:</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : connectionStatus ? (
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusIndicator,
              connectionStatus.connected ? styles.connected : styles.disconnected
            ]}>
              {connectionStatus.connected ? '🟢 Conectado' : '🔴 Desconectado'}
            </Text>
            <Text style={styles.statusMessage}>{connectionStatus.message}</Text>
            <Text style={styles.baseURL}>URL: {connectionStatus.baseURL}</Text>
            {connectionStatus.data && (
              <Text style={styles.dataInfo}>Datos: {JSON.stringify(connectionStatus.data)}</Text>
            )}
          </View>
        ) : null}
        
        {/* Botón para volver a intentar */}
        <Pressable 
          style={styles.retryButton}
          onPress={checkConnection}
          disabled={isLoading}
        >
          <Text style={styles.retryButtonText}>
            {isLoading ? 'Verificando...' : 'Verificar Conexión'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  connectionContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface || '#fff',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statusContainer: {
    marginBottom: SPACING.md,
  },
  statusIndicator: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  connected: {
    color: '#10B981',
  },
  disconnected: {
    color: '#EF4444',
  },
  statusMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  baseURL: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: SPACING.xs,
  },
  dataInfo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default HomeScreen;
