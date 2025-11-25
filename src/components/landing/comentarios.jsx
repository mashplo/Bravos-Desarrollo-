import { User } from "lucide-react"
import { useState, useEffect } from "react"
import { get_resenas, crear_resena, obtener_usuario_actual } from "../../herramientas/usuario"
import { toast } from "sonner"

export default function Comentarios() {
    const [resenas, set_resenas] = useState([])
    const [comentario, set_comentario] = useState('')
    const [calificacion, set_calificacion] = useState(5)
    const [usuario_actual, set_usuario_actual] = useState(null)

    useEffect(() => {
        cargar_resenas()
        cargar_usuario()
        
        // Actualizar cada 3 segundos
        const interval = setInterval(cargar_resenas, 3000)
        return () => clearInterval(interval)
    }, [])

    const cargar_resenas = async () => {
        const todas_resenas = await get_resenas()
        set_resenas(todas_resenas)
    }

    const cargar_usuario = async () => {
        const usuario = await obtener_usuario_actual()
        set_usuario_actual(usuario)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!usuario_actual) {
            toast.error("Debes iniciar sesión para dejar una reseña")
            setTimeout(() => {
                window.location.href = '/login'
            }, 1500)
            return
        }

        if (!comentario.trim()) {
            toast.error("Escribe un comentario")
            return
        }

        const resultado = await crear_resena({
            comentario: comentario,
            calificacion: calificacion
        })

        if (resultado.success) {
            toast.success(resultado.message)
            set_comentario('')
            set_calificacion(5)
            cargar_resenas()
        } else {
            toast.error(resultado.message)
        }
    }

    return (
        <section className="bg-white p-6 flex flex-col gap-10 md:px-40 lg:py-10">
            <h2 className="text-3xl font-bold">Reseñas de nuestros clientes</h2>
            
            {resenas.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resenas.map((reseña) => (
                        <li key={reseña.id} className="bg-[#D9D9D9] p-4 rounded-lg shadow">
                            <div className="flex items-center gap-4 mb-2">
                                <User className="size-8 rounded-full p-1 bg-black/10" />
                                <h3 className="font-semibold">{reseña.nombre}</h3>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < reseña.calificacion ? "text-yellow-500" : "text-gray-300"}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="mt-2">{reseña.comentario}</p>
                            <p className="text-xs text-gray-600 mt-2">
                                {new Date(reseña.fecha).toLocaleDateString('es-ES')}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Formulario para añadir reseña */}
            <div className="mt-10 border-t pt-10">
                <h3 className="text-2xl font-bold mb-6">Deja tu reseña</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Calificación:</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => set_calificacion(num)}
                                    className="text-3xl focus:outline-none"
                                >
                                    <span className={num <= calificacion ? "text-yellow-500" : "text-gray-300"}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">Tu comentario:</label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="Cuéntanos tu experiencia..."
                            value={comentario}
                            onChange={(e) => set_comentario(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                        Publicar Reseña
                    </button>
                </form>
            </div>
        </section>
    )
}