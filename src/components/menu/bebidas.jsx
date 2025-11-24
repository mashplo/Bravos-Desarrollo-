import { useState, useEffect } from "react"
import { getBebidas } from "../../herramientas/productos"
import { add_item_carrito } from "../../herramientas/usuario"
import { toast } from "sonner"

export default function Bebidas() {
    const [bebidas, setBebidas] = useState([])

    function pedir(index) {
        // El catálogo del backend usa IDs 0-5 para hamburguesas y 6-11 para bebidas.
        // Aquí mapeamos el índice del array de bebidas al ID correcto sumando 6.
        const idProducto = 6 + index;
        add_item_carrito({ id: idProducto });
        toast.success("Bebida añadida al carrito")
    }


    useEffect(() => {
        async function fetchBebidas() {
            const bebidasData = await getBebidas()
            setBebidas(bebidasData)
        }
        fetchBebidas()
    }, [])

    return (
        <div className="flex flex-col gap-5 px-5 py-10 md:px-10 lg:px-20">
            <h2 className="text-3xl font-bold">Bebidas</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bebidas.map((bebida, index) => (
                    <li key={bebida.name} className="card bg-base-100 shadow-xl overflow-hidden">
                        <figure className="h-48">
                            <img 
                                src={bebida.image_url} 
                                alt={bebida.name}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{bebida.name}</h3>
                            <div className="card-actions justify-between items-center mt-2">
                                <span className="text-2xl font-bold">S/{bebida.price}</span>
                                <button 
                                    onClick={() => pedir(index)} 
                                    className="btn btn-primary"
                                >
                                    Pedir
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}