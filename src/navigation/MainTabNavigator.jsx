import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import MovimientosScreen from '../screens/MovimientosScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

/**
 * Custom SVG Icons matching Figma design
 */
const HomeIcon = ({ color }) => (
  <Svg width="23" height="19" viewBox="0 0 23 19" fill="none">
    <Path
      d="M2 7L11.5 1L21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H4C3.46957 19 2.96086 18.7893 2.58579 18.4142C2.21071 18.0391 2 17.5304 2 17V7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 19V10H15V19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MovimientosIcon = ({ color }) => (
  <Svg width="17" height="25" viewBox="0 0 17 25" fill="none">
    <Path
      d="M1 7.5H16M1 12.5H16M1 17.5H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 2.5L1 7.5L4 12.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 12.5L16 17.5L13 22.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CuentasIcon = ({ color }) => (
  <Svg width="23" height="19" viewBox="0 0 23 19" fill="none">
    <Path
      d="M16 18V16C16 14.9391 15.5786 13.9217 14.8284 13.1716C14.0783 12.4214 13.0609 12 12 12H5C3.93913 12 2.92172 12.4214 2.17157 13.1716C1.42143 13.9217 1 14.9391 1 16V18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 9C10.7091 9 12.5 7.20914 12.5 5C12.5 2.79086 10.7091 1 8.5 1C6.29086 1 4.5 2.79086 4.5 5C4.5 7.20914 6.29086 9 8.5 9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 18V16C20.9993 15.1137 20.7044 14.2528 20.1614 13.5523C19.6184 12.8519 18.8581 12.3516 18 12.13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 1.13C15.8604 1.35031 16.623 1.85071 17.1676 2.55232C17.7122 3.25392 18.0078 4.11683 18.0078 5.005C18.0078 5.89318 17.7122 6.75608 17.1676 7.45769C16.623 8.15929 15.8604 8.65969 15 8.88"
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
 * Matches Figma design: https://www.figma.com/design/xiUjNo8i24a4SzMkCIN8Vz/Proyecto-Final
 */
const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#94A3B8', // Slate 400 - Active state
        tabBarInactiveTintColor: '#FFFFFF', // White - Inactive state
        tabBarStyle: {
          backgroundColor: '#1C1C1C', // Dark background
          borderTopColor: '#2D2D2D', // Más sutil que antes
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
          paddingHorizontal: 20,
          height: 75 + insets.bottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          position: 'absolute', // Para que se vea flotante
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          paddingHorizontal: 8,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false, // Hide default header
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Movimientos"
        component={MovimientosScreen}
        options={{
          tabBarLabel: 'Movimientos',
          tabBarIcon: ({ color }) => <MovimientosIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Cuentas"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cuentas',
          tabBarIcon: ({ color }) => <CuentasIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
