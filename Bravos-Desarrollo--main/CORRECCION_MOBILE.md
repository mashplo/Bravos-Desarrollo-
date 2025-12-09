# 🔧 CORRECCIÓN: Verificación de Usuarios en Móvil

## Problema Identificado

El sistema móvil no estaba verificando correctamente los usuarios debido a:

1. **Conflicto en el interceptor de axios**: El interceptor estaba agregando `deviceId` y `deviceType` automáticamente, pero el código de login también los enviaba, causando duplicación o sobrescritura.

2. **Falta de deviceId en registro**: El registro móvil no enviaba `deviceId` ni `deviceType`, por lo que no se creaba correctamente la sesión inicial.

## Cambios Realizados

### 1. ✅ `bravos-mobile/services/api.js`

**Problema**: El interceptor agregaba deviceId/deviceType automáticamente, causando conflictos.

**Solución**: Simplificar el interceptor para que solo maneje la autorización JWT.

```javascript
// ANTES (PROBLEMÁTICO)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt").catch(() => null);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Esto causaba conflictos
  if (config.url?.includes('/auth/')) {
    const deviceId = await getDeviceId();
    if (config.data) {
      config.data = {
        ...config.data,
        deviceId,
        deviceType: "mobile"
      };
    }
  }

  return config;
});

// DESPUÉS (CORREGIDO)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt").catch(() => null);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### 2. ✅ `bravos-mobile/screens/RegisterScreen.jsx`

**Problema**: No enviaba `deviceId` ni `deviceType` al registrarse.

**Solución**: Agregar deviceId y deviceType al registro, y guardar token/user automáticamente.

**Cambios**:
- Importar `getDeviceId` y `AsyncStorage`
- Obtener deviceId antes de registrar
- Enviar deviceId y deviceType en el POST
- Guardar token y user en AsyncStorage al registrarse exitosamente
- Redirigir directamente al menú en lugar de login

```javascript
// ANTES
const res = await api.post('/auth/register', {
  nombre,
  username,
  email,
  password,
});

// DESPUÉS
const deviceId = await getDeviceId();
const res = await api.post('/auth/register', {
  nombre,
  username,
  email,
  password,
  deviceId,
  deviceType: "mobile"
});

// Guardar token y usuario
if (res.data.token) {
  await AsyncStorage.setItem("jwt", res.data.token);
  await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
}

// Redirigir al menú
navigation.navigate("Menu", { initialCategory: "hamburguesas" })
```

## Flujo Corregido

### Registro Móvil
1. Usuario completa formulario de registro
2. Se genera/obtiene deviceId único del dispositivo
3. Se envía: nombre, username, email, password, **deviceId**, **deviceType: "mobile"**
4. Backend crea usuario y sesión inicial
5. Se guarda token y user en AsyncStorage
6. Redirección automática al menú (ya logueado)

### Login Móvil
1. Usuario ingresa credenciales
2. Se obtiene deviceId del dispositivo
3. Se envía: email, password, **deviceId**, **deviceType: "mobile"**
4. Backend verifica si hay sesión activa
5. Si hay sesión en otro dispositivo → Modal de confirmación
6. Si no hay sesión o es el mismo dispositivo → Login exitoso

## Verificación

### Test 1: Registro Nuevo Usuario
```
1. Abrir app móvil
2. Ir a "Sign Up"
3. Completar formulario
4. Presionar "Registrarse"
5. ✅ Debe guardar token y redirigir al menú
6. ✅ Debe aparecer en la tabla sessions con device_type='mobile'
```

### Test 2: Login Usuario Existente
```
1. Cerrar sesión en móvil
2. Iniciar sesión con credenciales
3. ✅ Debe verificar correctamente usuario/contraseña
4. ✅ Debe crear sesión en BD
5. ✅ Debe guardar token y redirigir al menú
```

### Test 3: Sesión Exclusiva
```
1. Iniciar sesión en Web
2. Intentar login en Móvil con mismo usuario
3. ✅ Debe mostrar modal de confirmación
4. Seleccionar "Sí"
5. ✅ Debe cerrar sesión en Web y activar en Móvil
```

## Archivos Modificados

1. ✅ `bravos-mobile/services/api.js` - Interceptor simplificado
2. ✅ `bravos-mobile/screens/RegisterScreen.jsx` - DeviceId agregado

## Notas Importantes

- **DeviceId persistente**: Se genera una vez y se guarda en AsyncStorage
- **No duplicar lógica**: El interceptor ya NO agrega deviceId automáticamente
- **Envío explícito**: Cada pantalla (Login/Register) envía deviceId explícitamente
- **Sesión automática**: Al registrarse, el usuario queda logueado automáticamente

## Resultado

✅ **Problema resuelto**: La verificación de usuarios en móvil ahora funciona correctamente.
