# Bravos Mobile

App móvil en React Native (Expo) para usuarios de Bravos Grill & Smoke.

## Estructura inicial
- `App.js`: punto de entrada y navegación.
- `screens/`: pantallas principales (Login, Registro, Perfil, Home).
- `components/`: componentes reutilizables.
- `services/`: conexión con la API (axios).
- `store/`: manejo de estado (usuario).

## Backend compartido
- La app móvil usa la misma API y base de datos que la web.
- Solo se implementan funciones de usuario (login, registro, perfil, pedidos).

## Para iniciar
1. Instala Expo CLI si no lo tienes:
   ```powershell
   npm install -g expo-cli
   ```
2. Instala dependencias recomendadas:
   ```powershell
   npx expo install @react-native-async-storage/async-storage
   npm install @react-navigation/native @react-navigation/native-stack axios
   ```
3. Ejecuta la app:
   ```powershell
   npx expo start
   ```

## Mockups y pantallas
- Puedes agregar aquí los mockups o la lista de pantallas que necesitas.

---

¿Listo para agregar los archivos base y la estructura? Envíame los mockups o pantallas y los creo.