import { ShoppingCart } from "lucide-react"
import { get_carrito } from "../../herramientas/usuario"
import { getHamburguesa, getBebidas } from "../../herramientas/productos"
import { useState, useEffect } from "react"
import ModalPago from "./modal-pago"
import { toast } from "sonner"

export default function Sidebar() {
    const [carrito_items, set_carrito_items] = useState([])
    const [total, set_total] = useState(0)
    
    const fetchCarrito = async () => {
        const carrito = await get_carrito()
        const productos = await Promise.all(
            carrito.map(async (item) => {
                const producto = await getHamburguesa({id: item.id})
                return producto ? { ...producto, cantidad: item.cantidad } : null
            })
        )
        const productos_validos = productos.filter(p => p !== null)
        set_carrito_items(productos_validos)
        
        const total_precio = productos_validos.reduce((sum, item) => sum + (item.price * item.cantidad), 0)
        set_total(total_precio)
    }
    
    useEffect(() => {
        fetchCarrito()
        
        // Actualizar carrito cada segundo para reflejar cambios
        const interval = setInterval(fetchCarrito, 1000)
        return () => clearInterval(interval)
    }, [])
    
    const toggleDrawer = () => {
        document.getElementById('my-drawer-1').checked = !document.getElementById('my-drawer-1').checked
    }

    const handleCompraExitosa = () => {
        localStorage.removeItem("carrito")
        set_carrito_items([])
        set_total(0)
        toast.success("¡Compra realizada con éxito!")
    }
    
    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <button onClick={toggleDrawer} className="p-2 rounded-full hover:bg-gray-200 drawer-button">
                    <div className="relative">
                        <ShoppingCart size={25} />
                        <div className="badge badge-error badge-xs absolute -top-2 -right-2 p-2 rounded-full">{carrito_items.length}</div>
                    </div>
                </button>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu bg-base-200 min-h-full w-80 p-4 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">Mi Carrito</h2>
                    
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {carrito_items.length === 0 ? (
                            <p className="text-center text-gray-500">El carrito está vacío</p>
                        ) : (
                            carrito_items.map((item, index) => (
                                <div key={index} className="card bg-base-100 shadow-sm">
                                    <div className="card-body p-3">
                                        <div className="flex gap-3">
                                            <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                                <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                                                <p className="text-sm font-bold">S/{(item.price * item.cantidad).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {carrito_items.length > 0 && (
                        <div className="mt-4 space-y-3">
                            <div className="divider my-2"></div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span>{total.toFixed(2)}</span>
                            </div>
                            <ModalPago 
                                carrito_items={carrito_items} 
                                total={total} 
                                onCompraExitosa={handleCompraExitosa}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}