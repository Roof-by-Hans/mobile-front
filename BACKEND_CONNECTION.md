# Configuración de Axios - Conexión con Backend

## Configuración Completada ✅

La conexión con el backend está configurada y lista para usar. Incluye:

### 1. Cliente API Base (`src/services/apiClient.js`)
- **Instancia de Axios** configurada con:
  - Base URL desde variables de entorno
  - Timeout de 10 segundos (configurable)
  - Headers automáticos (Content-Type: application/json)

### 2. Interceptores
- **Request Interceptor**: Añade automáticamente el token JWT a cada petición
- **Response Interceptor**: Maneja errores comunes:
  - 401: Limpia token y redirige a login
  - Errores de red
  - Timeouts

### 3. Gestión de Tokens
Funciones auxiliares exportadas:
- `setAuthToken(token)`: Guarda el token en AsyncStorage
- `removeAuthToken()`: Elimina el token
- `getAuthToken()`: Obtiene el token actual

### 4. Servicios Creados

#### Auth Service (`src/services/authService.js`)
- `login(email, password)`: Inicia sesión
- `register(userData)`: Registra nuevo usuario
- `logout()`: Cierra sesión
- `getCurrentUser()`: Obtiene perfil del usuario actual
- `refreshToken()`: Renueva el token de autenticación

#### User Service (`src/services/userService.js`)
- `getUserProfile(userId)`: Obtiene perfil de usuario
- `updateUserProfile(userId, userData)`: Actualiza perfil
- `deleteUser(userId)`: Elimina cuenta
- `getUsers(params)`: Lista usuarios con paginación
- `searchUsers(query)`: Busca usuarios

## Configuración de Variables de Entorno

Archivo `.env`:
```
API_URL=http://localhost:3000/api
API_TIMEOUT=10000
ENV=development
```

**Importante**: Para producción, actualiza `API_URL` con la URL de tu backend.

## Cómo Usar

### Ejemplo 1: Login en un Componente

```javascript
import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { login } from '../services/authService';
import Button from '../components/Button';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await login(email, password);
      // data contiene: { user: {...}, token: '...' }
      Alert.alert('Éxito', 'Login exitoso');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button onPress={handleLogin} loading={loading} title="Iniciar Sesión" />
    </View>
  );
};
```

### Ejemplo 2: Custom Hook para Fetch de Datos

```javascript
import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService';

/**
 * Custom hook para obtener perfil de usuario
 * @param {string} userId - ID del usuario
 * @returns {Object} { data, loading, error, refetch }
 */
export const useUserProfile = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await getUserProfile(userId);
      setData(profile);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { data, loading, error, refetch: fetchProfile };
};
```

### Ejemplo 3: Crear un Nuevo Servicio

```javascript
// src/services/productsService.js
import apiClient from './apiClient';

/**
 * Get all products
 * @param {Object} params - Query parameters { page, limit, category }
 * @returns {Promise<Object>} Response: { products: [], total }
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by ID
 * @param {string} productId
 * @returns {Promise<Object>} Response: { id, name, price, description, ... }
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

## Manejo de Errores Recomendado

Todos los servicios lanzan errores que deben manejarse:

```javascript
try {
  const data = await someService();
  // Éxito
} catch (error) {
  if (error.response) {
    // El servidor respondió con un código de error
    const status = error.response.status;
    const message = error.response.data?.message || 'Error del servidor';
    
    switch(status) {
      case 400: // Bad Request
        Alert.alert('Error', 'Datos inválidos');
        break;
      case 401: // Unauthorized
        Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
        break;
      case 404: // Not Found
        Alert.alert('Error', 'Recurso no encontrado');
        break;
      case 500: // Server Error
        Alert.alert('Error', 'Error del servidor');
        break;
      default:
        Alert.alert('Error', message);
    }
  } else if (error.request) {
    // No se recibió respuesta del servidor
    Alert.alert('Error de conexión', 'Verifica tu conexión a internet');
  } else {
    // Error al configurar la petición
    Alert.alert('Error', error.message);
  }
}
```

## Dependencias Instaladas

- ✅ `axios@^1.13.2`
- ✅ `@react-native-async-storage/async-storage`
- ✅ `react-native-dotenv@^3.4.11`

## Próximos Pasos

1. **Actualizar URL del Backend**: Modifica `.env` con la URL real de tu API
2. **Integrar con AuthContext**: Conecta los servicios de auth con tu contexto de autenticación
3. **Crear más servicios**: Agrega servicios específicos según los endpoints de tu backend
4. **Testing**: Prueba las conexiones con el backend real

## Notas Importantes

- Los tokens se almacenan en AsyncStorage con la clave `'authToken'`
- Los interceptores manejan automáticamente la autenticación
- Todos los servicios usan JSDoc para documentación
- Los errores se propagan para manejo personalizado en componentes
