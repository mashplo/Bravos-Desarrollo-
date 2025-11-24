export default function Summary() {
    const name = "Giovanny Jimenez"

    return (
        <section className="p-10">
            <div className="flex flex-col md:flex-row w-full justify-between gap-5 md:px-10">
                <div id="texto" className="flex flex-col gap-3">
                    <h2 className="text-4xl font-bold">Hola {name} 👋</h2>
                    <p className="text-lg">Bienvenido a tu perfil</p>
                </div>
                <div>
                    <button className="btn btn-secondary">Hacer un pedido</button>
                </div>
            </div>
        </section>
    )
}