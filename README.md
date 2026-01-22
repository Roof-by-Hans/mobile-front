# Mobile Front - Expo App

Aplicación móvil desarrollada con React Native y Expo siguiendo arquitectura feature-first.

## 📁 Estructura del Proyecto

```
mobile-front/
├── src/
│   ├── features/          # Módulos por funcionalidad
│   │   └── auth/          # Ejemplo: Autenticación
│   │       ├── index.js   # Exports centralizados
│   │       ├── api.js     # Llamadas API
│   │       ├── LoginScreen.jsx
│   │       ├── components/
│   │       └── hooks/
│   ├── components/        # UI Kit reutilizable
│   │   └── Button.jsx
│   ├── navigation/        # Configuración de navegación
│   │   └── AppNavigator.jsx
│   ├── services/          # Axios y servicios API
│   │   └── apiClient.js
│   ├── utils/             # Funciones helpers
│   │   └── helpers.js
│   ├── constants/         # Constantes globales
│   │   └── theme.js
│   └── assets/            # Imágenes, fuentes, etc.
├── screens/               # Pantallas (legacy/compatibility)
├── .env                   # Variables de entorno
├── .env.example           # Template de variables
├── App.js                 # Punto de entrada
└── package.json
```

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## 📱 Ejecutar la Aplicación

```bash
# Android
npm run android

# iOS (requiere macOS)
npm run ios

# Web
npm run web

# Expo Go
npx expo start
```

## 🛠️ Dependencias Principales

- **React Native & Expo**: Framework principal
- **React Navigation**: Navegación entre pantallas
- **Axios**: Cliente HTTP para API
- **react-native-dotenv**: Variables de entorno
- **PropTypes**: Validación de props

## 📐 Guías de Desarrollo

### Componentes
- Usar componentes funcionales y arrow functions
- Implementar PropTypes para validación
- Usar StyleSheet.create (prohibido estilos inline)
- Componentes nativos únicamente (View, Text, Pressable)

### Integración API
- Maneja 3 estados: Loading, Error, Success
- Usa try/catch con async/await
- Documenta estructura esperada de respuesta

### Features
- Organizar por funcionalidad
- Cada feature tiene: index.js, api.js, components/, hooks/
- Custom hooks para lógica compleja

## 🎨 Tema y Estilos

Los colores y estilos están definidos en `src/constants/theme.js`:
- COLORS: Paleta de colores
- SPACING: Espaciados consistentes
- FONT_SIZES: Tamaños de fuente
- BORDER_RADIUS: Radios de borde

## 🔐 Variables de Entorno

Configurar en `.env`:
- `API_URL`: URL del backend
- `API_TIMEOUT`: Timeout para requests
- `ENV`: Ambiente (development/production)

## 📝 Convenciones

- Archivos JSX para componentes (.jsx)
- Archivos JS para lógica/servicios (.js)
- JSDoc para funciones complejas
- Imports ordenados: externos → internos

## 🧪 Próximos Pasos

- [ ] Implementar AsyncStorage para persistencia
- [ ] Agregar más componentes UI reutilizables
- [ ] Configurar testing
- [ ] Implementar manejo de errores global
- [ ] Agregar más features

## 📖 Documentación

Ver `.github/instructions/Intrucciones.instructions.md` para guías detalladas de desarrollo.
