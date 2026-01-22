# 🚀 Guía Rápida de Inicio

## ▶️ Comandos Básicos

```bash
# Iniciar desarrollo
npm start

# Escanear QR con Expo Go app
# O presionar:
# - 'a' para Android
# - 'i' para iOS
# - 'w' para Web
```

## 📝 Crear un Nuevo Feature

```bash
# 1. Crear carpeta del feature
mkdir -p src/features/mi-feature/components
mkdir -p src/features/mi-feature/hooks

# 2. Crear archivos base
touch src/features/mi-feature/index.js
touch src/features/mi-feature/api.js
touch src/features/mi-feature/MiScreen.jsx
```

### Estructura de un Feature:
```javascript
// src/features/mi-feature/api.js
import apiClient from '../../services/apiClient';

export const fetchData = async () => {
  try {
    const response = await apiClient.get('/mi-endpoint');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// src/features/mi-feature/index.js
export { default as MiScreen } from './MiScreen';
export * from './api';
```

## 🎨 Crear un Componente Reutilizable

```javascript
// src/components/MiComponente.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING } from '../constants/theme';

const MiComponente = ({ titulo, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titulo}</Text>
      {children}
    </View>
  );
};

MiComponente.propTypes = {
  titulo: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default MiComponente;
```

## 🌐 Hacer una Llamada API

```javascript
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import apiClient from '../services/apiClient';

const MiScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Response: { id, name, description }
      const response = await apiClient.get('/endpoint');
      setData(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ... resto del componente
};
```

## 🎯 Agregar Nueva Pantalla

```javascript
// 1. Crear el componente en screens/ o dentro de un feature
// screens/NuevaPantalla.jsx

// 2. Agregar a la navegación
// src/navigation/AppNavigator.jsx
<Stack.Screen 
  name="NuevaPantalla" 
  component={NuevaPantalla}
  options={{ title: 'Nueva Pantalla' }}
/>

// 3. Navegar desde otra pantalla
navigation.navigate('NuevaPantalla', { param1: 'valor' });
```

## ⚙️ Variables de Entorno

```javascript
// Importar en cualquier archivo
import { API_URL, API_TIMEOUT, ENV } from '@env';

// Usar
console.log('API URL:', API_URL);
```

## 🎨 Usar el Sistema de Temas

```javascript
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,           // 24
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md, // 8
  },
  text: {
    fontSize: FONT_SIZES.lg,        // 18
    color: COLORS.white,
  },
});
```

## 🔧 Troubleshooting

### Error: Metro bundler no inicia
```bash
npx expo start -c  # Limpia cache
```

### Error: Module not found
```bash
rm -rf node_modules
npm install
```

### Error: .env no funciona
```bash
# Reiniciar el servidor después de cambiar .env
# Presionar 'r' en la terminal de Metro
```

## 📚 Recursos Útiles

- [Documentación Expo](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Components](https://reactnative.dev/docs/components-and-apis)
- [Axios Documentation](https://axios-http.com)

## 🎯 Checklist para Nuevas Features

- [ ] Crear carpeta en `src/features/`
- [ ] Implementar `api.js` con llamadas al backend
- [ ] Crear screens/componentes necesarios
- [ ] Implementar PropTypes en componentes
- [ ] Usar StyleSheet.create para estilos
- [ ] Manejar estados: Loading, Error, Success
- [ ] Documentar con JSDoc funciones complejas
- [ ] Agregar a navegación si es necesario
- [ ] Crear `index.js` con exports centralizados

---

**¡Listo para desarrollar! 🚀**
