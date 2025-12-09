# Sistema de Sesión Exclusiva - Implementación Completa

## Descripción
Sistema que permite solo una sesión activa por usuario a la vez, tanto en Web como en Móvil.

## Archivos Modificados/Creados

### Backend

1. **backend/src/models/session.model.js** ✅ (Ya existe)
   - Modelo de sesiones con campos: user_id, device_id, device_type, token, is_active, last_activity

2. **backend/src/controllers/auth.controller.js** ✅ (Ya actualizado)
   - `register`: Crea sesión inicial al registrarse
   - `login`: Detecta sesiones activas y requiere confirmación si existe otra sesión
   - `loginWithForce`: Cierra todas las sesiones anteriores y crea nueva sesión
   - `logout`: Cierra sesión específica del dispositivo

3. **backend/src/routes/auth.routes.js** ✅ (Ya actualizado)
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/login/force
   - POST /api/auth/logout

4. **backend/src/middlewares/auth.js** ✅ (Actualizado)
   - Valida que la sesión esté activa en la base de datos
   - Actualiza última actividad automáticamente
   - Retorna error si la sesión fue cerrada

5. **backend/src/server.js** ✅ (Actualizado)
   - Importa modelos para asegurar sincronización

6. **backend/scripts/create_sessions_table.sql** ✅ (Nuevo)
   - Script SQL para crear tabla manualmente si es necesario

### Frontend Web

1. **src/herramientas/usuario_login.js** ✅ (Ya actualizado)
   - `getDeviceId()`: Genera ID único para el navegador
   - `iniciar_sesion()`: Detecta sesiones activas
   - `iniciar_sesion_forzado()`: Fuerza cierre de otras sesiones
   - `cerrar_sesion_backend()`: Cierra sesión en el backend

2. **src/pages/login.jsx** ✅ (Ya actualizado)
   - Modal de confirmación cuando hay sesión activa
   - Botones Sí/No para confirmar cierre de otras sesiones
   - Manejo de estados de sesión

3. **src/components/navbar.jsx** ✅ (Ya actualizado)
   - Confirmación al cerrar sesión con window.confirm
   - Llama a cerrar_sesion_backend antes de limpiar localStorage

4. **src/herramientas/usuario.js** ✅ (Ya actualizado)
   - Función cerrar_sesion actualizada para llamar al backend

### Frontend Móvil

1. **bravos-mobile/services/api.js** ✅ (Ya actualizado)
   - `getDeviceId()`: Genera ID único para el dispositivo móvil
   - Interceptor que agrega deviceId y deviceType a todas las peticiones de auth

2. **bravos-mobile/screens/LoginScreenNew.jsx** ✅ (Ya actualizado)
   - Modal de confirmación cuando hay sesión activa
   - `handleLogin()`: Detecta sesiones activas
   - `handleForceLogin()`: Fuerza cierre de otras sesiones
   - Botones Sí/No en el modal

3. **bravos-mobile/screens/MenuScreen.jsx** ✅ (Actualizado)
   - Import de api agregado
   - `handleLogout()`: Confirmación con Alert antes de cerrar sesión
   - Llama a /api/auth/logout antes de limpiar AsyncStorage

## Flujo de Funcionamiento

### Registro
1. Usuario se registra en Web o Móvil
2. Se genera deviceId único
3. Se crea sesión inicial en la tabla sessions
4. Se retorna token JWT

### Login Normal
1. Usuario ingresa credenciales
2. Backend verifica si hay sesiones activas
3. Si NO hay sesiones activas → Login exitoso
4. Si HAY sesión activa en OTRO dispositivo → Retorna requireConfirmation: true
5. Frontend muestra modal de confirmación

### Login Forzado (Confirmación Sí)
1. Usuario confirma que quiere cerrar otras sesiones
2. Se llama a /api/auth/login/force con forceLogin: true
3. Backend desactiva TODAS las sesiones anteriores (is_active = false)
4. Se crea nueva sesión activa
5. Login exitoso

### Cancelar Login (Confirmación No)
1. Usuario cancela el login
2. No se crea nueva sesión
3. La sesión anterior permanece activa
4. Usuario no puede ingresar

### Logout
1. Usuario hace clic en cerrar sesión
2. Se muestra confirmación (window.confirm en Web, Alert en Móvil)
3. Si confirma:
   - Se llama a /api/auth/logout con deviceId
   - Backend marca sesión como inactiva (is_active = false)
   - Se limpia localStorage/AsyncStorage
   - Redirección a pantalla de inicio

### Validación de Sesión
1. Cada petición autenticada pasa por authMiddleware
2. Middleware verifica que el token exista en sessions con is_active = true
3. Si la sesión no está activa → Error 401 con sessionExpired: true
4. Si está activa → Actualiza last_activity y permite la petición

## Instalación

### Backend
```bash
cd backend
npm install
# La tabla se creará automáticamente con sequelize.sync()
# Si no se crea, ejecutar: backend/scripts/create_sessions_table.sql
npm start
```

### Frontend Web
```bash
npm install
npm run dev
```

### Frontend Móvil
```bash
cd bravos-mobile
npm install
npx expo start
```

## Variables de Entorno

### Backend (.env)
```
JWT_SECRET=tu_secreto_jwt
DATABASE_URL=mysql://user:password@host:port/database
PORT=3000
```

### Frontend Web (.env)
```
VITE_API_URL=http://localhost:3000
```

### Frontend Móvil
En `bravos-mobile/services/api.js`:
```javascript
const API_URL = "https://bravos-backend-production.up.railway.app/api";
```

## Pruebas

### Escenario 1: Login en Web, luego en Móvil
1. Iniciar sesión en Web
2. Intentar iniciar sesión en Móvil con mismo usuario
3. Debe aparecer modal: "Tu cuenta está activa en otro dispositivo..."
4. Si selecciona Sí → Cierra sesión en Web y activa en Móvil
5. Si selecciona No → Mantiene sesión en Web, no permite login en Móvil

### Escenario 2: Login en Móvil, luego en Web
1. Iniciar sesión en Móvil
2. Intentar iniciar sesión en Web con mismo usuario
3. Debe aparecer modal de confirmación
4. Si selecciona Sí → Cierra sesión en Móvil y activa en Web
5. Si selecciona No → Mantiene sesión en Móvil, no permite login en Web

### Escenario 3: Logout con confirmación
1. Estar logueado en cualquier dispositivo
2. Hacer clic en cerrar sesión
3. Debe aparecer confirmación
4. Si confirma → Cierra sesión correctamente
5. Si cancela → Mantiene sesión activa

### Escenario 4: Sesión cerrada en otro dispositivo
1. Estar logueado en Web y Móvil (con confirmación)
2. Cerrar sesión en Web
3. Intentar hacer una acción en Móvil (crear pedido, etc.)
4. Debe recibir error de sesión expirada
5. Debe redirigir a login

## Seguridad

- ✅ Tokens JWT con expiración de 7 días
- ✅ Validación de sesión activa en cada petición
- ✅ Actualización de última actividad
- ✅ Cierre automático de sesiones anteriores
- ✅ DeviceId único por dispositivo
- ✅ Tipo de dispositivo (web/mobile) registrado

## Notas Importantes

1. **DeviceId persistente**: Se guarda en localStorage (Web) y AsyncStorage (Móvil)
2. **Sincronización**: La tabla sessions se crea automáticamente con Sequelize
3. **Compatibilidad**: Funciona con el sistema existente sin romper funcionalidad
4. **Middleware**: Todas las rutas protegidas usan authMiddleware actualizado
5. **UX**: Mensajes claros y confirmaciones antes de acciones destructivas

## Solución de Problemas

### La tabla sessions no se crea
- Ejecutar manualmente: `backend/scripts/create_sessions_table.sql`
- Verificar que el modelo esté importado en `backend/src/models/index.models.js`

### Error "Sesión inválida o cerrada"
- El usuario fue deslogueado en otro dispositivo
- Redirigir a login y limpiar localStorage/AsyncStorage

### Modal no aparece al hacer login
- Verificar que el backend retorne `requireConfirmation: true`
- Revisar console.log en frontend para ver respuesta del servidor

### Sesión no se cierra en el otro dispositivo
- Verificar que el middleware esté validando is_active
- Confirmar que loginWithForce esté desactivando sesiones anteriores
