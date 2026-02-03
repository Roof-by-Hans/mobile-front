import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Platform, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import DetalleMovimientoScreen from '../screens/DetalleMovimientoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Stack Navigator for Movimientos Tab
 */
const MovimientosStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MovimientosList" component={MovimientosScreen} />
      <Stack.Screen name="DetallesMovimiento" component={DetalleMovimientoScreen} />
    </Stack.Navigator>
  );
};

/**
 * Custom SVG Icons matching Figma design
 * Dimensiones según Figma: width: 26.02, height: 34 (container)
 */
const HomeIcon = ({ color }) => (
  <Svg width="26" height="34" viewBox="0 0 26 34" fill="none">
    <Path
      d="M2.17 9.24L13.17 2L24.17 9.24V27.76C24.17 28.5548 23.854 29.3169 23.2914 29.8795C22.7288 30.4421 21.9667 30.76 21.17 30.76H5.17C4.37326 30.76 3.61111 30.4421 3.0485 29.8795C2.48589 29.3169 2.17 28.5548 2.17 27.76V9.24Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.17 30.76V16.76H17.17V30.76"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


const MovimientosIcon = ({ color }) => (
  <Svg width="26" height="34" viewBox="0 0 20 14" fill="none">
    <Path
      d="M7.01 9L0 9L0 11L7.01 11L7.01 14L11 10L7.01 6L7.01 9Z"
      fill={color}
    />
    <Path
      d="M12.99 8L12.99 5L20 5L20 3L12.99 3L12.99 0L9 4L12.99 8Z"
      fill={color}
    />
  </Svg>
);

const CuentasIcon = ({ color }) => (
  <Svg width="26" height="34" viewBox="0 0 26 34" fill="none">
    <Path
      d="M21.34 32.66V29.32C21.34 27.6539 20.6779 26.0556 19.4902 24.8679C18.3025 23.6802 16.7042 23.02 15.04 23.02H7.66C5.99587 23.02 4.39759 23.6802 3.20987 24.8679C2.02216 26.0556 1.36 27.6539 1.36 29.32V32.66"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.35 16.34C14.9399 16.34 17.85 13.4299 17.85 9.84C17.85 6.25014 14.9399 3.34 11.35 3.34C7.76014 3.34 4.85 6.25014 4.85 9.84C4.85 13.4299 7.76014 16.34 11.35 16.34Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Main Tab Navigator
 * Handles protected routes with bottom tab navigation
 * Matches Figma design: Nav con backdrop blur y estilo glassmorphism
 */
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary, // Amarillo dorado cuando está activo
        tabBarInactiveTintColor: COLORS.gray, // Gris cuando está inactivo
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              style={StyleSheet.absoluteFill}
              tint="dark"
              intensity={80}
            />
            <View style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderTopColor: COLORS.border,
              borderTopWidth: 1,
            }} />
          </View>
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 17,
          paddingHorizontal: 48,
          height: 83,
          position: 'absolute',
          elevation: 0,
        },
        tabBarShowLabel: false, // Sin labels de texto
        tabBarIcon: ({ focused, color }) => {
          let IconComponent;
          
          if (route.name === 'Inicio') {
            IconComponent = HomeIcon;
          } else if (route.name === 'Movimientos') {
            IconComponent = MovimientosIcon;
          } else if (route.name === 'Cuentas') {
            IconComponent = CuentasIcon;
          }
          
          return (
            <View style={{ alignItems: 'center' }}>
              <IconComponent color={focused ? COLORS.primary : COLORS.gray} />
              {/* Indicador de estado activo (punto) */}
              {focused && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.primary,
                  marginTop: 6,
                  position: 'absolute',
                  bottom: -10
                }} />
              )}
            </View>
          );
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          height: 34,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Movimientos"
        component={MovimientosStack}
      />
      <Tab.Screen
        name="Cuentas"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
