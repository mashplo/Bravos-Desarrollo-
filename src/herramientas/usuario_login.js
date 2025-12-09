
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
