# Integración de Autenticación con Backend

## Resumen de la Implementación

Se ha completado la integración de autenticación del frontend móvil con el backend de Hans en `http://localhost:3000/api`.

## Cambios Realizados

### 1. Dependencias Instaladas
- ✅ `expo-secure-store` - Almacenamiento seguro de tokens
- ✅ `axios-retry` - Reintentos automáticos en peticiones fallidas

### 2. Nuevo Módulo: tokenStorage.js
**Ubicación:** `src/utils/tokenStorage.js`

Proporciona funciones para gestionar tokens de forma segura:
- `saveToken(token)` - Guarda token de acceso
- `getToken()` - Recupera token de acceso
- `saveRefreshToken(refreshToken)` - Guarda refresh token
- `getRefreshToken()` - Recupera refresh token
- `saveUserData(userData)` - Guarda datos del usuario
- `getUserData()` - Recupera datos del usuario
- `clearAuth()` - Limpia toda la autenticación
- `hasStoredSession()` - Verifica si existe sesión guardada

### 3. Actualización de authService.js
**Ubicación:** `src/services/authService.js`

#### Endpoints Integrados:
- `POST /api/auth-cliente/login` - Login de clientes móviles
  - Request: `{ nombreUsuario, contrasena }`
  - Response: `{ success, message, data: { token, usuario } }`

- `POST /api/clientes` - Registro de nuevos clientes
  - Request: FormData con campos del cliente
  - Response: `{ success, message, data: { cliente } }`

#### Nuevas Funciones:
- `login(nombreUsuario, contrasena)` - Autenticación con backend real
- `register(userData)` - Registro con multipart/form-data
- `logout()` - Limpieza completa de sesión
- `getCurrentUser()` - Obtiene usuario desde storage local
- `hasValidSession()` - Verifica si existe sesión válida
- `restoreSession()` - Restaura sesión desde SecureStore

### 4. Actualización de apiClient.js
**Ubicación:** `src/services/apiClient.js`

#### Mejoras Implementadas:
- ✅ Interceptor de request que inyecta automáticamente el token JWT
- ✅ Interceptor de response con manejo inteligente de errores 401
- ✅ Configuración de reintentos automáticos (3 intentos con delay exponencial)
- ✅ Uso de SecureStore en lugar de AsyncStorage
- ✅ Manejo de cola para peticiones durante refresh de token

#### Manejo de Errores:
- 401 Unauthorized → Limpia sesión y fuerza re-login
- 403 Forbidden → Log de permisos insuficientes
- 404 Not Found → Log de recurso no encontrado
- 500+ Server Errors → Log con mensaje amigable
- Network Errors → Log con sugerencias de troubleshooting

### 5. Actualización de AuthContext.jsx
**Ubicación:** `src/context/AuthContext.jsx`

#### Funcionalidades Nuevas:
- ✅ Restauración automática de sesión al iniciar la app (useEffect)
- ✅ Estado de `isLoading` inicia en `true` para restauración
- ✅ Nuevo estado `error` para mensajes de error del backend
- ✅ Login integrado con backend real
- ✅ Register con login automático después de registro exitoso
- ✅ Logout con limpieza completa de tokens

#### Flujo de Restauración:
1. App inicia
2. AuthContext intenta restaurar sesión desde SecureStore
3. Si hay token válido → Usuario autenticado automáticamente
4. Si no hay token → Usuario debe hacer login

### 6. Actualización de LoginScreen.jsx
**Ubicación:** `src/screens/LoginScreen.jsx`

#### Cambios:
- ✅ Campo `email` reemplazado por `nombreUsuario`
- ✅ Validación ajustada (min 3 caracteres para username)
- ✅ Validación de contraseña ajustada (min 4 caracteres)
- ✅ Integración con backend real a través de AuthContext
- ✅ Manejo de errores del backend con mensajes amigables

### 7. Actualización de RegisterScreen.jsx
**Ubicación:** `src/screens/RegisterScreen.jsx`

#### Cambios:
- ✅ Integración básica con backend
- ✅ Mapeo temporal de campos (nombre → nombre/apellido)
- ✅ Nivel de suscripción por defecto (idNivelSuscripcion: 1)
- ✅ Login automático después de registro exitoso

#### ⚠️ NOTA IMPORTANTE:
El RegisterScreen actual es una versión simplificada. El backend requiere:
- `nombre` (separado de apellido)
- `apellido`
- `nombreUsuario` (único)
- `contrasena`
- `email`
- `idNivelSuscripcion` (selección de nivel)
- `telefono` (opcional)
- `fotoPerfil` (opcional, multipart/form-data)

**Pendiente:** Crear formulario completo con todos los campos requeridos.

## Flujo de Autenticación

### Login:
1. Usuario ingresa `nombreUsuario` y `contrasena`
2. POST a `/api/auth-cliente/login`
3. Backend responde con `{ token, usuario }`
4. Token guardado en SecureStore
5. Datos de usuario guardados en SecureStore
6. Token inyectado en headers de axios
7. Usuario redirigido a Home

### Persistencia de Sesión:
1. App inicia
2. AuthContext busca token en SecureStore
3. Si existe token:
   - Usuario restaurado automáticamente
   - Token inyectado en headers
   - Navegación a Home
4. Si no existe token:
   - Navegación a Login

### Manejo de Token Expirado:
1. Request con token expirado
2. Backend responde 401
3. Interceptor detecta 401
4. Limpia tokens de SecureStore
5. Usuario redirigido a Login

## Variables de Entorno

Asegúrate de tener configurado en `.env`:
```
API_URL=http://localhost:3000/api
API_TIMEOUT=15000
```

**⚠️ IMPORTANTE:** Si estás en un dispositivo físico o emulador, reemplaza `localhost` por la IP de tu PC en la red local (ej: `http://192.168.1.100:3000/api`).

## Seguridad Implementada

✅ Tokens almacenados en SecureStore (encriptado en iOS/Android)
✅ Tokens nunca expuestos en logs de producción
✅ Headers de autenticación inyectados automáticamente
✅ Limpieza automática en caso de token expirado
✅ Validación de inputs en frontend

## Testing

Para probar la integración:

1. Asegúrate de que el backend esté corriendo en `http://localhost:3000`
2. Usa las credenciales de un cliente existente en la base de datos
3. Prueba el login con `nombreUsuario` y `contrasena`
4. Cierra y reabre la app para verificar persistencia de sesión
5. Prueba el logout para verificar limpieza de tokens

## Próximos Pasos Recomendados

1. **Ampliar RegisterScreen:**
   - Agregar campos: nombre, apellido, nombreUsuario separados
   - Selector de nivel de suscripción
   - Campo de teléfono
   - Subida de foto de perfil

2. **Implementar Refresh Token:**
   - El backend actual no tiene endpoint de refresh token
   - Cuando se implemente, actualizar el interceptor de apiClient

3. **Mejorar Manejo de Errores:**
   - Crear componente de notificaciones Toast
   - Mejorar mensajes de error específicos por código

4. **Agregar Validaciones:**
   - Verificar disponibilidad de nombreUsuario antes de registro
   - Validación de formato de email más robusta
   - Indicador de fortaleza de contraseña

5. **Testing:**
   - Agregar tests unitarios para authService
   - Tests de integración para flujo completo de autenticación

## Documentación del Backend

Swagger: http://localhost:3000/api-docs

### Schemas Relevantes:
- `LoginRequest`: { nombreUsuario, contrasena }
- `LoginResponse`: { success, message, data: { token, usuario } }
- `Cliente`: { id, nombre, apellido, nombreUsuario, email, activo, roles, ... }

---

**Fecha de Implementación:** 28 de enero de 2026
**Branch:** feature/autenticacion-backend
