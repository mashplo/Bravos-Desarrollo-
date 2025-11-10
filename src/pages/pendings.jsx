import NavbarPerfil from "../components/perfil/navbar"
import { Hamburger } from "lucide-react"
import { useState, useEffect } from "react"
import { get_pedidos, actualizar_estado_pedido } from "../herramientas/usuario"

export default function Pendings() {
  const [pedidos_pendientes, set_pedidos_pendientes] = useState([])
  const [pedidos_entregados, set_pedidos_entregados] = useState([])

  useEffect(() => {
    cargar_pedidos()
    
    // Actualizar cada 2 segundos
    const interval = setInterval(cargar_pedidos, 2000)
    return () => clearInterval(interval)
  }, [])

  const cargar_pedidos = async () => {
    const todos_pedidos = await get_pedidos()
    const pendientes = todos_pedidos.filter(p => p.estado === "en_preparacion")
    const entregados = todos_pedidos.filter(p => p.estado === "entregado")
    set_pedidos_pendientes(pendientes)
    set_pedidos_entregados(entregados)
  }

  const marcar_como_listo = async (id) => {
    await actualizar_estado_pedido({ id: id, nuevo_estado: "entregado" })
    cargar_pedidos()
  }


  return (
    <main className="flex flex-col">
      <NavbarPerfil />
      <section className="flex flex-col md:flex-row w-full h-screen">
        <div className="w-full h-full flex flex-col">
          <div className="p-5 flex flex-col items-start justify-center">
            <div className="flex flex-col justify-center items-center rounded-2xl p-3">
              <Hamburger size={50} />
              <span className="text-xl font-bold">Bravos</span>
            </div>
            <h1 className="text-3xl font-bold">Pendientes</h1>
            <ul className="flex flex-col">
              {pedidos_pendientes.length === 0 ? (
                <p className="text-gray-500 my-5">No hay pedidos pendientes</p>
              ) : (
                pedidos_pendientes.map((pedido) => (
                  <li key={pedido.id} className="flex flex-col gap-3 my-5 p-4 border rounded-lg bg-base-100 shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Pedido #{pedido.id}</span>
                      <span className="badge badge-warning">En preparación</span>
                    </div>
                    {pedido.items.map((item, idx) => (
                      <div key={idx} className="flex flex-row gap-5">
                        <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
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
                      <button 
                        onClick={() => marcar_como_listo(pedido.id)}
                        className="btn btn-success btn-sm"
                      >
                        Listo
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-10 bg-secondary text-secondary-content w-full h-full p-8">
              <h1 className="text-4xl font-bold">Entregados</h1>
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
      </section>
    </main>
  )
}