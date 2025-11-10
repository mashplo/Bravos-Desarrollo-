import Navbar from "../components/navbar"
import Comentarios from "../components/landing/comentarios"

export default function Resenas() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <div className="flex-grow h-full">
                <Comentarios />
            </div>
        </main>
    )
}