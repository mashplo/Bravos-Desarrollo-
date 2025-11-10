import { useState, useEffect } from "react"
import { getHamburguesas } from "../../herramientas/productos"
import { add_item_carrito } from "../../herramientas/usuario"
import { toast } from "sonner"

export default function Hamburguesas() {
    const [hamburguesas, setHamburguesas] = useState([])

    function pedir(id_hamburguesa) {
        add_item_carrito({id: id_hamburguesa})
        toast.success("Hamburguesa añadida al carrito")
    }

    useEffect(() => {
        async function fetchHamburguesas() {
            const data = await getHamburguesas()
            setHamburguesas(data)
        }
        fetchHamburguesas()
    }, [])

    return (
        <div className="flex flex-col gap-5 px-5 py-10 md:px-10 lg:px-20">
            <h2 className="text-3xl font-bold">Nuestras hamburguesas</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hamburguesas.map((hamburguesa, index) => (
                    <li key={hamburguesa.name} className="card bg-base-100 shadow-xl overflow-hidden">
                        <figure className="h-48">
                            <img 
                                src={hamburguesa.image_url} 
                                alt={hamburguesa.name}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{hamburguesa.name}</h3>
                            <div className="card-actions justify-between items-center mt-2">
                                <span className="text-2xl font-bold">S/{hamburguesa.price}</span>
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