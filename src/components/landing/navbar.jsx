import { Hamburger } from "lucide-react"
import { ShoppingCart, User } from "lucide-react"

export default function Navbar() {
    return (
        <header className="flex flex-row justify-between bg-base-300 px-5">
            <div id="logo_empresa" className="w-full p-2">
                <Hamburger className="size-10" />
            </div>
            <div id="links" className="flex-1 flex flex-row gap-2 items-center">
                <a href="#" className="btn btn-ghost">Home</a>
                <a href="#" className="btn btn-ghost">About</a>
                <a href="#" className="btn btn-ghost">Contact</a>
            </div>
            <div id="botones" className="flex flex-row items-center justify-end w-full gap-3">
                <User className="size-8" />
                <ShoppingCart className="size-8" />
            </div>
        </header>
    )
}