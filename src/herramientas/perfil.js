const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api`; // profile routes are at /api/profile

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    return { success: false, message: "Respuesta inválida del servidor" };
  }
  if (!res.ok) {
    return { success: false, message: data?.message || "Error del servidor" };
  }
  return data;
}

export async function obtener_perfil() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No hay sesión activa" };
    }

    const res = await fetch(`${API}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error obtener_perfil:", error);
    return { success: false, message: "Error de conexión al servidor" };
  }
}

export async function actualizar_perfil({ nombre, email, username, currentPassword, newPassword }) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No hay sesión activa" };
    }

    const updateData = { nombre, email, username };
    
    // Solo incluir password si se quiere cambiar
    if (newPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }

    const res = await fetch(`${API}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await handleResponse(res);
    
    // Si se actualizó exitosamente, actualizar el usuario en localStorage
    if (data.success && data.user) {
      localStorage.setItem("usuario_actual", JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Error actualizar_perfil:", error);
    return { success: false, message: "Error de conexión al servidor" };
  }
}