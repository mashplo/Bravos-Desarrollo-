
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000"; // sin path final

// Ajusta si montaste las rutas con app.use('/api', authRoutes)
const API = `${API_BASE}/api/auth`; //ajustao

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    return { success: false, message: "Respuesta inválida del servidor" };
  }
  if (!res.ok) {
    // si el backend envía { success:false, message: "..." } lo devolvemos
    return { success: false, message: data?.message || "Error del servidor" };
  }
  return data;
}

export async function registrar_usuario({ nombre, email, password, username }) {
  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, username })
    });

    return await handleResponse(res);

  } catch (error) {
    console.error("Error registrar_usuario:", error);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

export async function iniciar_sesion({ email, password }) {
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse(res);

    if (data.success) {
      // Guardamos el usuario para la UI
      localStorage.setItem("usuario_actual", JSON.stringify(data.user));

      // Guardamos el token para autenticación
      localStorage.setItem("token", data.token);
    }

    return data;

  } catch (err) {
    console.error("Error iniciar_sesion:", err);
    return { success: false, message: "Error de conexión al servidor" };
  }
}
