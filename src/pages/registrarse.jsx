import { useState } from "react"
import { registrar_usuario } from "../herramientas/usuario"
import { toast, Toaster } from "sonner"

export default function Registrarse() {
    const [nombre, set_nombre] = useState('')
    const [email, set_email] = useState('')
    const [username, set_username] = useState('')
    const [password, set_password] = useState('')
    const [password_confirm, set_password_confirm] = useState('')

    const handleRegistro = async (e) => {
        e.preventDefault()

        if (!nombre || !email || !username || !password || !password_confirm) {
            toast.error("Todos los campos son obligatorios")
            return
        }

        if (password !== password_confirm) {
            toast.error("Las contraseñas no coinciden")
            return
        }

        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres")
            return
        }

        const resultado = await registrar_usuario({
            nombre,
            email,
            password,
            direccion: username // Usando username como dirección por ahora
        })

        if (resultado.success) {
            toast.success(resultado.message)
            setTimeout(() => {
                window.location.href = '/login'
            }, 1500)
        } else {
            toast.error(resultado.message)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative">
            <Toaster position="top-right" richColors />
            <img src="/logo.png" alt="" className="w-40" />
            <form onSubmit={handleRegistro} className="flex flex-col gap-2 w-80 py-10 border px-5 ">
                <h2 className="text-4xl font-bold mb-4 text-center">Registro</h2>
                <div className="flex flex-col">
                    <span className="text-sm">Nombres</span>
                    <input
                        type="text"
                        placeholder="Tus nombres"
                        className="input"
                        value={nombre}
                        onChange={(e) => set_nombre(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Correo</span>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="input"
                        value={email}
                        onChange={(e) => set_email(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Nombre de usuario</span>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input"
                        value={username}
                        onChange={(e) => set_username(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Contraseña</span>
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => set_password(e.target.value)}
                    />                    
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">Repite la contraseña</span>
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password_confirm}
                        onChange={(e) => set_password_confirm(e.target.value)}
                    />                    
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Registrarse                     
                </button>
            </form>
        </main>
    )
}