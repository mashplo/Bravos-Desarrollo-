import { Hamburger } from "lucide-react"

export default function Navbar() {
    return (
        <header className="bg-base-300 rounded-b-3xl border w-full flex flex-row justify-between items-center px-5 py-5">
            <div>
                <Hamburger className="size-12" />
            </div>
            <div>
                <button className="btn btn-primary">Cerrar sesión</button>
            </div>
        </header>
    )
}