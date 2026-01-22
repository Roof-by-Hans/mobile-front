# 🏗️ Arquitectura del Proyecto

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
│                    (Entry Point)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   AppNavigator.jsx                          │
│              (Navigation Configuration)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐     ┌─────────┐     ┌─────────┐
   │ Screen1 │     │ Screen2 │     │ Screen3 │
   └────┬────┘     └────┬────┘     └────┬────┘
        │               │               │
        └───────┬───────┴───────┬───────┘
                │               │
                ▼               ▼
        ┌─────────────┐  ┌──────────────┐
        │  Features   │  │  Components  │
        │  /auth      │  │  Button      │
        │  /profile   │  │  Input       │
        └──────┬──────┘  └──────────────┘
               │
               ▼
        ┌─────────────┐
        │  Services   │
        │  apiClient  │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │   Backend   │
        │     API     │
        └─────────────┘
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│                 (Press Button, Input Text)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SCREEN COMPONENT                           │
│                  - Handle user action                       │
│                  - Update local state                       │
│                  - Call API function                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FEATURE API (api.js)                       │
│                  - Import apiClient                         │
│                  - Make HTTP request                        │
│                  - Return response                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              API CLIENT (apiClient.js)                      │
│              - Add authentication token                     │
│              - Configure headers                            │
│              - Send request to backend                      │
│              - Handle errors                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                              │
│                  - Process request                          │
│                  - Return response                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  HANDLE RESPONSE                            │
│                  - Success: Update UI                       │
│                  - Error: Show alert/message                │
│                  - Loading: Show ActivityIndicator          │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura de Carpetas Detallada

```
mobile-front/
│
├── 📱 App.js                    # Entry point, configura navegación
│
├── 🔧 Configuración
│   ├── .env                     # Variables de entorno
│   ├── .env.example             # Template de variables
│   ├── babel.config.js          # Configuración de Babel
│   ├── app.json                 # Configuración de Expo
│   └── package.json             # Dependencias
│
├── 📖 Documentación
│   ├── README.md                # Documentación principal
│   ├── PROJECT_SUMMARY.md       # Resumen del proyecto
│   ├── QUICK_START.md           # Guía rápida
│   └── ARCHITECTURE.md          # Este archivo
│
├── 📂 src/
│   │
│   ├── 🎯 features/             # FEATURES (Funcionalidades)
│   │   │                        # Cada feature es independiente
│   │   │
│   │   └── auth/                # Ejemplo: Autenticación
│   │       ├── index.js         # Exports centralizados
│   │       ├── api.js           # Llamadas API del feature
│   │       ├── LoginScreen.jsx  # Pantalla de login
│   │       │
│   │       ├── components/      # Componentes específicos
│   │       │   └── LoginForm.jsx
│   │       │
│   │       └── hooks/           # Custom hooks del feature
│   │           └── useAuth.js
│   │
│   ├── 🎨 components/           # COMPONENTES REUTILIZABLES
│   │   ├── Button.jsx           # Botón personalizado
│   │   ├── Input.jsx            # Input de texto
│   │   ├── Card.jsx             # Tarjeta
│   │   └── index.js             # Exports centralizados
│   │
│   ├── 🧭 navigation/           # NAVEGACIÓN
│   │   ├── AppNavigator.jsx     # Navegador principal
│   │   └── AuthNavigator.jsx    # Navegador de autenticación
│   │
│   ├── 🌐 services/             # SERVICIOS
│   │   ├── apiClient.js         # Configuración de Axios
│   │   ├── storage.js           # AsyncStorage helpers
│   │   └── notifications.js     # Push notifications
│   │
│   ├── 🛠️ utils/                # UTILIDADES
│   │   ├── helpers.js           # Funciones helpers generales
│   │   ├── validators.js        # Validaciones
│   │   └── formatters.js        # Formateo de datos
│   │
│   ├── 🎨 constants/            # CONSTANTES
│   │   ├── theme.js             # Tema (colores, spacing, etc)
│   │   ├── config.js            # Configuraciones globales
│   │   └── routes.js            # Nombres de rutas
│   │
│   └── 📦 assets/               # RECURSOS ESTÁTICOS
│       ├── images/              # Imágenes
│       ├── icons/               # Iconos
│       └── fonts/               # Fuentes personalizadas
│
├── 📺 screens/                  # PANTALLAS (legacy/compatibility)
│   └── HomeScreen.jsx
│
└── 📝 types/                    # TIPOS (TypeScript)
    └── env.d.ts                 # Tipos para variables de entorno
```

## 🔀 Flujo de Desarrollo de un Feature

```
1. CREAR ESTRUCTURA
   ├── src/features/mi-feature/
   ├── src/features/mi-feature/index.js
   ├── src/features/mi-feature/api.js
   └── src/features/mi-feature/MiScreen.jsx

2. IMPLEMENTAR API (api.js)
   └── Definir funciones que llaman al backend
       - login()
       - fetchData()
       - updateData()

3. CREAR SCREEN (MiScreen.jsx)
   ├── Import API functions
   ├── Manejar estados (loading, error, data)
   ├── Implementar UI con componentes
   └── Agregar PropTypes si recibe props

4. CREAR COMPONENTES ESPECÍFICOS (opcional)
   └── src/features/mi-feature/components/
       └── MiComponente.jsx

5. CREAR CUSTOM HOOKS (opcional)
   └── src/features/mi-feature/hooks/
       └── useMiFeature.js

6. EXPORTAR (index.js)
   └── export { MiScreen, login, fetchData }

7. AGREGAR A NAVEGACIÓN
   └── src/navigation/AppNavigator.jsx
       <Stack.Screen name="MiScreen" component={MiScreen} />
```

## 🔗 Dependencias Entre Módulos

```
┌──────────────────────────────────────────────────────────┐
│                        Features                          │
│                                                          │
│  - Pueden usar: components, services, utils, constants  │
│  - NO deben depender de otros features                  │
└────────────────────┬─────────────────────────────────────┘
                     │ ✓ puede usar
                     ▼
┌──────────────────────────────────────────────────────────┐
│                      Components                          │
│                                                          │
│  - Pueden usar: constants                               │
│  - NO deben usar: features, services (salvo excepciones)│
└────────────────────┬─────────────────────────────────────┘
                     │ ✓ puede usar
                     ▼
┌──────────────────────────────────────────────────────────┐
│                       Services                           │
│                                                          │
│  - Pueden usar: utils, constants                        │
│  - NO deben usar: features, components                  │
└────────────────────┬─────────────────────────────────────┘
                     │ ✓ puede usar
                     ▼
┌──────────────────────────────────────────────────────────┐
│                    Utils & Constants                     │
│                                                          │
│  - NO deben depender de otros módulos                   │
│  - Son completamente independientes                     │
└──────────────────────────────────────────────────────────┘
```

## 🎯 Principios de Arquitectura

### 1. **Feature-First (Funcionalidad Primero)**
- Organizar código por funcionalidad, no por tipo de archivo
- Cada feature es una cápsula independiente
- Fácil de encontrar, modificar y eliminar

### 2. **Separation of Concerns (Separación de Responsabilidades)**
- API: Solo llamadas al backend
- Screens: Solo UI y lógica de presentación
- Components: Solo UI reutilizable
- Services: Solo configuración de servicios

### 3. **DRY (Don't Repeat Yourself)**
- Componentes reutilizables en `/components`
- Funciones helpers en `/utils`
- Constantes en `/constants`

### 4. **Single Responsibility (Responsabilidad Única)**
- Cada archivo tiene una única responsabilidad
- Cada función hace una sola cosa
- Componentes pequeños y enfocados

### 5. **Dependency Direction (Dirección de Dependencias)**
- Features → Components → Services → Utils → Constants
- Nunca al revés
- Evita dependencias circulares

---

## 🔍 Ejemplo Práctico: Feature de Perfil

```
src/features/profile/
│
├── index.js                     # export { ProfileScreen, getProfile, ... }
│
├── api.js                       # Llamadas API
│   ├── getProfile()
│   ├── updateProfile()
│   └── uploadAvatar()
│
├── ProfileScreen.jsx            # Pantalla principal
│   ├── useState para loading/error/data
│   ├── useEffect para cargar datos
│   ├── Renderiza ProfileHeader + ProfileForm
│   └── Maneja navegación
│
├── components/                  # Componentes del feature
│   ├── ProfileHeader.jsx       # Header con avatar
│   ├── ProfileForm.jsx         # Formulario de edición
│   └── ProfileStats.jsx        # Estadísticas
│
└── hooks/                       # Custom hooks
    ├── useProfile.js           # Hook para gestionar perfil
    └── useAvatar.js            # Hook para upload de avatar
```

### Flujo:
1. Usuario abre ProfileScreen
2. Screen llama a `getProfile()` de `api.js`
3. `api.js` usa `apiClient` de `services/`
4. Datos se guardan en estado del screen
5. Screen renderiza `ProfileHeader` y `ProfileForm`
6. Componentes usan datos via props
7. Usuario edita y envía formulario
8. Screen llama a `updateProfile()`
9. Success → actualiza UI / Error → muestra alerta

---

**✅ Arquitectura limpia, escalable y mantenible**
