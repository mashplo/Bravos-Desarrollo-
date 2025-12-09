export default function Recents() {
    const pedidos_recientes = [
        {
            id: 1,
            name: "Triple queso",
            precio: 13,
            fecha: "2024-01-15",
            estado: "entregado",
            restaurante: "Burger Palace"
        },
        {
            id: 2,
            name: "Pizza Margherita",
            precio: 18,
            fecha: "2024-01-14",
            estado: "entregado",
            restaurante: "Pizzería Roma"
        },
        {
            id: 3,
            name: "Tacos al Pastor",
            precio: 12,
            fecha: "2024-01-13",
            estado: "cancelado",
            restaurante: "Taquería El Azteca"
        },
        {
            id: 4,
            name: "Sushi Variado",
            precio: 25,
            fecha: "2024-01-12",
            estado: "entregado",
            restaurante: "Sushi Bar Tokio"
        },
        {
            id: 5,
            name: "Pollo a la Brasa",
            precio: 15,
            fecha: "2024-01-11",
            estado: "en preparación",
            restaurante: "Pollería Don Pollo"
        },
        {
            id: 6,
            name: "Ceviche Mixto",
            precio: 20,
            fecha: "2024-01-10",
            estado: "entregado",
            restaurante: "Marisquería El Pescador"
        }
    ]

    const getEstadoBadge = (estado) => {
        const baseClasses = "badge badge-sm font-medium";
        switch (estado) {
            case "entregado":
                return `${baseClasses} badge-success`;
            case "cancelado":
                return `${baseClasses} badge-error`;
            case "en preparación":
                return `${baseClasses} badge-warning`;
            default:
                return `${baseClasses} badge-neutral`;
        }
    }

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    return (
        <section className="w-full mx-auto p-6 md:px-20">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-base-content mb-2">Pedidos Recientes</h2>
                <p className="text-base-content/70">Historial de tus últimas órdenes</p>
            </div>

            <div className="grid grid-cols-2 ">
                {pedidos_recientes.map((pedido) => (
                    <div key={pedido.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="card-title text-lg">{pedido.name}</h3>
                                        <span className={getEstadoBadge(pedido.estado)}>
                                            {pedido.estado}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatFecha(pedido.fecha)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xl font-bold text-primary">S/{pedido.precio}</div>
                                    <div className="text-sm text-base-content/70">Total</div>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button className="btn btn-ghost btn-sm">Ver detalles</button>
                                {pedido.estado === "entregado" && (
                                    <button className="btn btn-primary btn-sm">Volver a pedir</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pedidos_recientes.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold mb-2">No hay pedidos recientes</h3>
                    <p className="text-base-content/70">¡Haz tu primer pedido y aparecerá aquí!</p>
                </div>
            )}
        </section>
    )
}