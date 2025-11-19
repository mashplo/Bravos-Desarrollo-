export default function NavbarPerfil() {
    return (
        <nav className="flex flex-row justify-between items-center p-6 bg-white shadow-md">
            <div className="text-2xl font-bold">Bravos</div>
            <div className="flex flex-row gap-4 items-center justify-center">
                <a href="/" className="text-gray-700 hover:text-gray-900 btn btn-error">Cerrar Sesión</a>
            </div>
        </nav>
    )
}