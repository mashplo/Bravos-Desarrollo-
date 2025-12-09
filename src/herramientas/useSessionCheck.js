import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export function useSessionCheck(intervalMs = 10000) {
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-session`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      // Si la sesión expiró o fue invalidada
      if (res.status === 401 || data.sessionExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario_actual");
        navigate("/login?sessionExpired=true");
      }
    } catch (err) {
      // Error de red, no hacer nada (podría ser temporal)
      console.warn("Error verificando sesión:", err);
    }
  }, [navigate]);

  useEffect(() => {
    // Verificar inmediatamente al montar
    checkSession();

    // Configurar intervalo de verificación
    const intervalId = setInterval(checkSession, intervalMs);

    // También verificar cuando la ventana vuelve a tener foco
    const handleFocus = () => {
      checkSession();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkSession, intervalMs]);

  return { checkSession };
}
