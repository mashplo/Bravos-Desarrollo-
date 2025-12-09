import { User, LogOut, UserCircle } from "lucide-react";
import Sidebar from "./menu/sidebar";
import RdfButton from "./rdfButton";
import { useState, useEffect, useCallback } from "react";
import { obtener_usuario_actual, cerrar_sesion } from "../herramientas/usuario";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const [usuario_actual, set_usuario_actual] = useState(null);

  // Función para verificar si la sesión sigue activa
  const checkSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-session`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.status === 401 || data.sessionExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario_actual");
        set_usuario_actual(null);
        toast.warning(
          "Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo."
        );
        window.location.href = "/login?sessionExpired=true";
      }
    } catch (err) {
      console.warn("Error verificando sesión:", err);
    }
  }, []);

  useEffect(() => {
    cargar_usuario();

    // Verificar sesión cada 10 segundos
    const intervalId = setInterval(checkSession, 10000);

    // Verificar cuando la ventana vuelve a tener foco
    const handleFocus = () => checkSession();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkSession]);

  const cargar_usuario = async () => {
    const usuario = await obtener_usuario_actual();
    set_usuario_actual(usuario);
  };

  const handleCerrarSesion = async () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );
    if (!confirmacion) {
      return;
    }
    await cerrar_sesion();
    toast.success("Sesión cerrada exitosamente");
    set_usuario_actual(null);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <nav className="flex flex-row justify-between items-center px-6 bg-gray-100 shadow-md gap-10 text-xl">
      <div className="flex flex-row items-center gap-10">
        <a href="/">
          <img src="/logo.png" alt="" className="w-30" />
        </a>
        <ul className="flex flex-row gap-6">
          <li>
            <a href="/" className="text-gray-800 hover:text-black">
              Home
            </a>
          </li>
          <li>
            <a href="/menu" className="text-gray-800 hover:text-black">
              Pide aquí
            </a>
          </li>
          <li>
            <a href="/resenas" className="text-gray-800 hover:text-black">
              Reseñas
            </a>
          </li>
          {usuario_actual && (
            <li>
              <a href="/historial" className="text-gray-800 hover:text-black">
                Mis Pedidos
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="flex flex-row items-center gap-3">
        <RdfButton />
        {usuario_actual ? (
          <>
            <span className="text-sm font-medium">
              Hola, {usuario_actual.nombre}
            </span>

            <a
              href="/profile"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              title="Mi Perfil"
            >
              <UserCircle size={25} className="text-gray-800" />
            </a>
            <button
              onClick={handleCerrarSesion}
              className="btn btn-sm btn-ghost gap-2"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </>
        ) : (
          <a href="/login" className="p-2 rounded-full hover:bg-gray-200">
            <User size={25} />
          </a>
        )}
        <Sidebar />
      </div>
    </nav>
  );
}
