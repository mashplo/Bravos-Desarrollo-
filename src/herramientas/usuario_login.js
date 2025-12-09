
const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api/auth`;

// Generar o recuperar deviceId único para este navegador
function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    return { success: false, message: "Respuesta inválida del servidor" };
  }
  
  // Manejar caso especial de conflicto de sesión (409)
  if (res.status === 409 && data.requireConfirmation) {
    return data;
  }
  
  if (!res.ok) {
    return { success: false, message: data?.message || "Error del servidor", ...data };
  }
  return data;
}

export async function registrar_usuario({ nombre, email, password, username }) {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, username, deviceId, deviceType: "web" })
    });

    return await handleResponse(res);

  } catch (error) {
    console.error("Error registrar_usuario:", error);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

export async function iniciar_sesion({ email, password }) {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, deviceId, deviceType: "web" })
    });

    const data = await handleResponse(res);

    // Si requiere confirmación, devolver el objeto completo
    if (data.requireConfirmation) {
      return data;
    }

    if (data.success) {
      localStorage.setItem("usuario_actual", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    }

    return data;

  } catch (err) {
    console.error("Error iniciar_sesion:", err);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

export async function iniciar_sesion_forzado({ email, password }) {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`${API}/login/force`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, deviceId, deviceType: "web", forceLogin: true })
    });

    const data = await handleResponse(res);

    if (data.success) {
      localStorage.setItem("usuario_actual", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    }

    return data;

  } catch (err) {
    console.error("Error iniciar_sesion_forzado:", err);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

export async function cerrar_sesion_backend() {
  try {
    const token = localStorage.getItem("token");
    const deviceId = getDeviceId();
    
    if (!token) return { success: true };

    const res = await fetch(`${API}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ deviceId })
    });

    return await handleResponse(res);

  } catch (err) {
    console.error("Error cerrar_sesion_backend:", err);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

// Función para verificar si la sesión sigue activa
export function handleSessionExpired(response) {
  if (response.sessionExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario_actual");
    // Redirigir al login con mensaje
    window.location.href = "/login?sessionExpired=true";
    return true;
  }
  return false;
}

// Helper para hacer requests autenticados
export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    
    // Si la sesión expiró, manejar el redirect
    if (res.status === 401 && data.sessionExpired) {
      handleSessionExpired(data);
      return { success: false, sessionExpired: true };
    }
    
    return data;
  } catch (err) {
    console.error("Error en authenticatedFetch:", err);
    return { success: false, message: "Error de conexión" };
  }
}
