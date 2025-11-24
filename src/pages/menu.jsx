import Navbar from "../components/navbar"
import Hamburguesas from "../components/menu/hamburguesas"
import Bebidas from "../components/menu/bebidas"
import { Toaster } from "sonner"

export default function Menu() {
    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <Toaster richColors />
            <div className="flex flex-col gap-10">
                <Hamburguesas />
                <Bebidas />
            </div>
        </main>
    )
}