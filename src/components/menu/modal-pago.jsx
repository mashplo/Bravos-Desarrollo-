import { useState } from "react"
import { CreditCard, Smartphone, Wallet, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { crear_pedido } from "../../herramientas/usuario"

export default function ModalPago({ carrito_items, total, onCompraExitosa }) {
    const [metodo_pago, set_metodo_pago] = useState('')

    const metodos_pago = [
        { id: 'tarjeta', nombre: 'Tarjeta', icono: CreditCard },
        { id: 'efectivo', nombre: 'Efectivo', icono: DollarSign },
        { id: 'transferencia', nombre: 'Transferencia', icono: Smartphone },
        { id: 'wallet', nombre: 'Wallet Digital', icono: Wallet }
    ]

    const handlePagar = async () => {
        if (!metodo_pago) {
            toast.error("Por favor selecciona un método de pago")
            return
        }
        
        // Crear el pedido
        await crear_pedido({
            items: carrito_items,
            total: total,
            metodo_pago: metodo_pago
        })
        
        onCompraExitosa()
        document.getElementById('modal-pago').close()
        set_metodo_pago('')
    }

    const abrirModal = () => {
        document.getElementById('modal-pago').showModal()
    }

    return (
        <>
            <button onClick={abrirModal} className="btn btn-primary w-full">
                Realizar Compra
            </button>

            <dialog id="modal-pago" className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl mb-4">Finalizar Compra</h3>
                    
                    {/* Steps */}
                    <ul className="steps steps-horizontal w-full mb-6">
                        <li className="step step-primary">Seleccionar Productos</li>
                        <li className="step step-primary">Calcular Subtotal</li>
                        <li className="step step-primary">Realizar Pago</li>
                    </ul>

                    {/* Resumen */}
                    <div className="bg-base-200 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold mb-2">Resumen de compra</h4>
                        <div className="flex justify-between items-center text-lg">
                            <span>{carrito_items.length} producto(s)</span>
                            <span className="font-bold">S/{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Métodos de Pago */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-3">Selecciona tu método de pago</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {metodos_pago.map((metodo) => (
                                <button
                                    key={metodo.id}
                                    onClick={() => set_metodo_pago(metodo.id)}
                                    className={`card bg-base-100 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                                        metodo_pago === metodo.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                >
                                    <div className="card-body items-center text-center p-6">
                                        <metodo.icono size={32} className={metodo_pago === metodo.id ? 'text-primary' : ''} />
                                        <p className="font-semibold mt-2">{metodo.nombre}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost mr-2">Cancelar</button>
                        </form>
                        <button onClick={handlePagar} className="btn btn-primary">
                            Pagar S/{total.toFixed(2)}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}
