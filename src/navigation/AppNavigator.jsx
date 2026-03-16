import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import DetalleMovimientoScreen from '../screens/DetalleMovimientoScreen';

const Stack = createStackNavigator();

const AuthenticatedNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="DetallesMovimiento" component={DetalleMovimientoScreen} />
  </Stack.Navigator>
);

/**
 * Main navigation configuration
 * Handles conditional routing based on authentication state
 * - Unauthenticated users: AuthNavigator (Login/Register)
 * - Authenticated users: MainTabNavigator (Home/Search/Profile/Settings)
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
      {isAuthenticated ? <AuthenticatedNavigator /> : <AuthNavigator />}
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
