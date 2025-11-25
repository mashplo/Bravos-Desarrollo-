
import { Hamburger } from "lucide-react"
import { useState, useEffect } from "react"
import { get_pedidos, actualizar_estado_pedido } from "../herramientas/usuario"

export default function Pendings() {
  const [pedidos_pendientes, set_pedidos_pendientes] = useState([])
  const [pedidos_entregados, set_pedidos_entregados] = useState([])

  useEffect(() => {
    cargar_pedidos()
    const interval = setInterval(cargar_pedidos, 2000)
    return () => clearInterval(interval)
  }, [])

  const cargar_pedidos = async () => {
    const todos_pedidos = await get_pedidos()
    const pendientes = todos_pedidos.filter(p => p.estado === "en_preparacion" || p.estado === "enviado")
    const entregados = todos_pedidos.filter(p => p.estado === "entregado")
    set_pedidos_pendientes(pendientes)
    set_pedidos_entregados(entregados)
  }

  const marcar_como_enviado = async (id) => {
    try {
      await actualizar_estado_pedido({ id: id, nuevo_estado: "enviado" });
      setTimeout(cargar_pedidos, 500);
    } catch (error) {
      alert("No se pudo actualizar el estado del pedido. Intenta de nuevo.");
    }
  }

  const marcar_como_entregado = async (id) => {
    try {
      await actualizar_estado_pedido({ id: id, nuevo_estado: "entregado" });
      setTimeout(cargar_pedidos, 500);
    } catch (error) {
      alert("No se pudo actualizar el estado del pedido. Intenta de nuevo.");
    }
  }

  const borrar_entregados = () => {
    // Intentar borrar en el backend si hay token, si no, caer a eliminación local
    const token = localStorage.getItem("token");
    const backend = import.meta.env.VITE_API_URL;
    if (token && backend) {
      fetch(`${backend}/api/pedidos/entregados`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then(() => cargar_pedidos())
        .catch((e) => {
          console.error("Error borrando entregados en backend:", e);
          // fallback a eliminación local
          const pedidos = localStorage.getItem("pedidos") ? JSON.parse(localStorage.getItem("pedidos")) : [];
          const nuevos = pedidos.filter(p => p.estado !== "entregado");
          localStorage.setItem("pedidos", JSON.stringify(nuevos));
          cargar_pedidos();
        });
      return;
    }

    // Fallback: Elimina los pedidos entregados del localStorage y del estado
    const pedidos = localStorage.getItem("pedidos") ? JSON.parse(localStorage.getItem("pedidos")) : [];
    const nuevos = pedidos.filter(p => p.estado !== "entregado");
    localStorage.setItem("pedidos", JSON.stringify(nuevos));
    cargar_pedidos();
  }

  const cerrar_sesion = () => {
    localStorage.removeItem("usuario_actual");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const reiniciar_contador = async () => {
    if (!confirm("⚠️ ADVERTENCIA: Esto borrará TODOS los pedidos y reiniciará el contador a 1. ¿Estás seguro?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const backend = import.meta.env.VITE_API_URL || "https://bravos-backend-production.up.railway.app";
      
      const response = await fetch(`${backend}/api/pedidos/reset-counter`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert("✅ Contador reiniciado exitosamente. El próximo pedido será #1");
        cargar_pedidos();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error reiniciando contador:", error);
      alert("❌ Error al reiniciar el contador");
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-base-200">
      <nav className="flex flex-row justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold">Bravos</div>
        <div className="flex gap-3">
          <button className="btn btn-warning btn-sm" onClick={reiniciar_contador}>
            Reiniciar Contador
          </button>
          <button className="btn btn-error" onClick={cerrar_sesion}>Cerrar sesión</button>
        </div>
      </nav>
      <section className="flex flex-col md:flex-row w-full h-screen">
        <div className="w-full h-full flex flex-col">
          <div className="p-5 flex flex-col items-start justify-center">
            <div className="flex flex-col justify-center items-center rounded-2xl p-3">
              <Hamburger size={50} />
              <span className="text-xl font-bold">Pendientes</span>
            </div>
            <h1 className="text-3xl font-bold">Pedidos Pendientes</h1>
            <div className="overflow-y-auto max-h-[60vh] w-full border rounded-lg bg-base-100 shadow p-2">
              <ul className="flex flex-col">
                {pedidos_pendientes.length === 0 ? (
                  <p className="text-gray-500 my-5">No hay pedidos pendientes</p>
                ) : (
                  pedidos_pendientes.map((pedido) => (
                    <li key={pedido.id} className="flex flex-col gap-3 my-5 p-4 border rounded-lg bg-base-100 shadow">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
                          <span className="text-xs text-gray-400">Pago: {pedido.metodo_pago}</span>
                        </div>
                        <span className={`badge ${pedido.estado === 'enviado' ? 'badge-info' : 'badge-warning'}`}>
                          {pedido.estado === 'enviado' ? 'Enviado' : 'En preparación'}
                        </span>
                      </div>
                      {pedido.items.map((item, idx) => (
                        <div key={idx} className="flex flex-row gap-5">
                          <img src={item.image_url || '/default-burger.png'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <h2 className="text-lg font-semibold">{item.name}</h2>
                              <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                              <p className="text-xs text-gray-400">ID producto: {item.id}</p>
                            </div>
                            <span className="text-md font-bold">S/{(item.price * item.cantidad).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="divider my-1"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total: S/{pedido.total.toFixed(2)}</span>
                        <div className="flex gap-2">
                          {pedido.estado === 'en_preparacion' && (
                            <button 
                              onClick={() => marcar_como_enviado(pedido.id)}
                              className="btn btn-info btn-sm"
                            >
                              Enviado
                            </button>
                          )}
                          <button 
                            onClick={() => marcar_como_entregado(pedido.id)}
                            className="btn btn-success btn-sm"
                          >
                            Entregado
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 bg-secondary text-secondary-content w-full h-full p-8">
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-4xl font-bold">Entregados</h1>
                <button className="btn btn-error btn-sm" onClick={borrar_entregados}>Borrar entregados</button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] w-full border rounded-lg bg-base-100 shadow p-2">
                <ul className="flex flex-col gap-6">
                  {pedidos_entregados.length === 0 ? (
                    <p className="text-secondary-content/70">No hay pedidos entregados</p>
                  ) : (
                    pedidos_entregados.map((pedido) => (
                      <li key={pedido.id} className="flex flex-col gap-3 p-4 bg-base-100 text-base-content rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
                          <span className="badge badge-success">Entregado</span>
                        </div>
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col lg:flex-row gap-5">
                            <img src={item.image_url} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                              </div>
                              <span className="text-md font-bold">S/{(item.price * item.cantidad).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        <div className="divider my-1"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total: S/{pedido.total.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
        </div>
      </section>
    </main>
  )
}