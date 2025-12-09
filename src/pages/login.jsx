import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  iniciar_sesion,
  iniciar_sesion_forzado,
} from "../herramientas/usuario_login";
import { toast, Toaster } from "sonner";

export default function Login() {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [showPassword, set_showPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next");
  const sessionExpired = params.get("sessionExpired");

  // Mostrar mensaje si la sesión expiró
  useEffect(() => {
    if (sessionExpired === "true") {
      toast.warning(
        "Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo."
      );
    }
  }, [sessionExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const resultado = await iniciar_sesion({
      email,
      password,
    });

    // Si requiere confirmación
    if (resultado.requireConfirmation) {
      setSessionData({ email, password });
      setShowConfirmDialog(true);
      return;
    }

    if (resultado.success) {
      toast.success(resultado.message);

      localStorage.setItem("usuario_actual", JSON.stringify(resultado.user));
      localStorage.setItem("token", resultado.token);

      const es_admin = resultado.user.role === "admin";
      setTimeout(() => {
        if (next) {
          try {
            navigate(decodeURIComponent(next));
          } catch (e) {
            navigate(next);
          }
          return;
        }
        if (es_admin) {
          navigate("/pendings");
        } else {
          navigate("/");
        }
      }, 800);
    } else {
      toast.error(resultado.message);
    }
  };

  const handleForceLogin = async () => {
    if (!sessionData) return;

    const resultado = await iniciar_sesion_forzado({
      email: sessionData.email,
      password: sessionData.password,
    });

    setShowConfirmDialog(false);
    setSessionData(null);

    if (resultado.success) {
      toast.success("Sesión iniciada. Las otras sesiones han sido cerradas.");

      localStorage.setItem("usuario_actual", JSON.stringify(resultado.user));
      localStorage.setItem("token", resultado.token);

      const es_admin = resultado.user.role === "admin";
      setTimeout(() => {
        if (next) {
          try {
            navigate(decodeURIComponent(next));
          } catch (e) {
            navigate(next);
          }
          return;
        }
        if (es_admin) {
          navigate("/pendings");
        } else {
          navigate("/");
        }
      }, 800);
    } else {
      toast.error(resultado.message);
    }
  };

  const handleCancelForceLogin = () => {
    setShowConfirmDialog(false);
    setSessionData(null);
    toast.info("Inicio de sesión cancelado");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative">
      <Toaster position="top-right" richColors />
      <a href="/registrarse" className="absolute top-8 right-8 text-sm btn">
        ¿No tienes una cuenta? Regístrate
      </a>
      <a href="/menu" className="absolute top-8 left-8 text-sm btn btn-ghost">
        ← Volver al menú
      </a>
      <img src="/logo.png" alt="" className="w-40" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 py-10">
        <div className="flex flex-col">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => set_email(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm">Contraseña</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pr-16"
              value={password}
              onChange={(e) => set_password(e.target.value)}
            />
            <button
              type="button"
              onClick={() => set_showPassword((p) => !p)}
              className="absolute top-1/2 -translate-y-1/2 right-2 btn btn-xs btn-ghost"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar sesión
        </button>
      </form>

      {/* Modal de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Sesión activa detectada</h3>
            <p className="text-gray-700 mb-6">
              Tu cuenta está activa en otro dispositivo. ¿Deseas continuar aquí
              y cerrar la otra sesión?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelForceLogin}
                className="btn btn-ghost"
              >
                No
              </button>
              <button onClick={handleForceLogin} className="btn btn-primary">
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
