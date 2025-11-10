import { useState } from "react"
import { iniciar_sesion } from "../herramientas/usuario"
import { toast, Toaster } from "sonner"

export default function Login() {
    const [email, set_email] = useState('')
    const [password, set_password] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error("Todos los campos son obligatorios")
            return
        }

        const resultado = await iniciar_sesion({
            email,
            password
        })

        if (resultado.success) {
            toast.success(resultado.message)
            setTimeout(() => {
                // Redirigir según tipo de usuario
                if (resultado.es_admin) {
                    window.location.href = '/pendings'
                } else {
                    window.location.href = '/'
                }
            }, 1500)
        } else {
            toast.error(resultado.message)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative">
            <Toaster position="top-right" richColors />
            <a href="/registrarse" className="absolute top-8 right-8 text-sm btn">¿No tienes una cuenta? Regístrate</a>
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
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={(e) => set_password(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Iniciar sesión
                </button>
            </form>
        </main>
    )
}