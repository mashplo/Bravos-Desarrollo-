import { User, LogOut } from "lucide-react"

import Sidebar from "./menu/sidebar"
import { useState, useEffect } from "react"
import { obtener_usuario_actual, cerrar_sesion } from "../herramientas/usuario"
import { toast } from "sonner"

export default function Navbar() {
    const [usuario_actual, set_usuario_actual] = useState(null)

    useEffect(() => {
        cargar_usuario()
    }, [])

    const cargar_usuario = async () => {
        const usuario = await obtener_usuario_actual()
        set_usuario_actual(usuario)
    }

    const handleCerrarSesion = async () => {
        await cerrar_sesion()
        toast.success("Sesión cerrada exitosamente")
        set_usuario_actual(null)
        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }

    return (
        <nav className="flex flex-row justify-between items-center px-6 bg-gray-100 shadow-md gap-10 text-xl">
            <div className="flex flex-row items-center gap-10">
                <a href="/" >
                    <img src="/logo.png" alt="" className="w-30" />
                </a>
                <ul className="flex flex-row gap-6">
                    <li><a href="/" className="text-gray-800 hover:text-black">Home</a></li>
                    <li><a href="/menu" className="text-gray-800 hover:text-black">Pide aquí</a></li>
                    <li><a href="/resenas" className="text-gray-800 hover:text-black">Reseñas</a></li>
                </ul>
            </div>
            <div className="flex flex-row items-center gap-3">
                {usuario_actual ? (
                    <>
                        <span className="text-sm font-medium">Hola, {usuario_actual.nombre}</span>
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
    )
}