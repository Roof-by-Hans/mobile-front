import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

/**
 * Main navigation configuration
 * Handles conditional routing based on authentication state
 * - Unauthenticated users: AuthNavigator (Login/Register)
 * - Authenticated users: MainTabNavigator (Home/Search/Profile/Settings)
 * 
 * NOTA: Actualmente mostrando MainTabNavigator directamente para desarrollo
 * Para activar autenticación, descomentar la lógica condicional
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading indicator while checking authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Mostrando tabs directamente para desarrollo */}
      <MainTabNavigator />
      
      {/* Descomentar para activar flujo de autenticación: */}
      {/* {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />} */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
