import { useState, useEffect } from "react"
import { Package, Clock, Truck, CheckCircle } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function Historial() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const backend = import.meta.env.VITE_API_URL || "https://bravos-backend-production.up.railway.app"
      const response = await fetch(`${backend}/api/pedidos/historial`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setPedidos(data.pedidos)
      }
    } catch (error) {
      console.error("Error cargando historial:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case "en_preparacion":
        return { 
          icon: Clock, 
          color: "text-warning", 
          bgColor: "bg-warning/10", 
          label: "En preparación" 
        }
      case "enviado":
        return { 
          icon: Truck, 
          color: "text-info", 
          bgColor: "bg-info/10", 
          label: "Enviado" 
        }
      case "entregado":
        return { 
          icon: CheckCircle, 
          color: "text-success", 
          bgColor: "bg-success/10", 
          label: "Entregado" 
        }
      default:
        return { 
          icon: Package, 
          color: "text-gray-500", 
          bgColor: "bg-gray-100", 
          label: estado 
        }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package size={32} className="text-primary" />
            <h1 className="text-4xl font-bold">Mi Historial de Pedidos</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No tienes pedidos aún</p>
              <a href="/menu" className="btn btn-primary mt-4">
                Ver Menú
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => {
                const estadoConfig = getEstadoConfig(pedido.estado)
                const IconoEstado = estadoConfig.icon

                return (
                  <div key={pedido.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      {/* Header del pedido */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="card-title text-2xl">Pedido #{pedido.id}</h2>
                          <p className="text-sm text-gray-500">
                            {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${estadoConfig.bgColor}`}>
                          <IconoEstado size={20} className={estadoConfig.color} />
                          <span className={`font-semibold ${estadoConfig.color}`}>
                            {estadoConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Items del pedido */}
                      <div className="space-y-3 mb-4">
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-3 bg-base-200 rounded-lg">
                            <img 
                              src={item.image_url || '/default-burger.png'} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                              </div>
                              <span className="text-lg font-bold">
                                S/{(item.price * item.cantidad).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer del pedido */}
                      <div className="divider my-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Método de pago: <span className="font-semibold">{pedido.metodo_pago}</span>
                        </div>
                        <div className="text-2xl font-bold">
                          Total: S/{pedido.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
