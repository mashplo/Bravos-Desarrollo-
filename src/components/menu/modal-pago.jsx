import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Smartphone, Wallet, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { crear_pedido } from "../../herramientas/usuario";

export default function ModalPago({ carrito_items, total, onCompraExitosa }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [metodo_pago, set_metodo_pago] = useState("");
  const [handledAutoOpen, setHandledAutoOpen] = useState(false);

  useEffect(() => {
    // Si la URL contiene openModal=1, abrir el modal automáticamente.
    const params = new URLSearchParams(location.search);
    const openModal = params.get("openModal") === "1";
    const autoPay = params.get("autoPay") === "1";

    if (openModal && !handledAutoOpen) {
      try {
        document.getElementById("modal-pago").showModal();
      } catch (e) {}
      setHandledAutoOpen(true);

      // Recuperar método de pago que pudo haberse guardado antes de redirigir
      const pending = localStorage.getItem("pending_metodo_pago");
      if (pending && !metodo_pago) {
        set_metodo_pago(pending);
        // limpiar
        localStorage.removeItem("pending_metodo_pago");
        // si viene autoPay, intentar pagar
        if (autoPay) {
          setTimeout(() => {
            handlePagar();
          }, 200);
        }
        return;
      }

      // Solo intentar pago automático si ya se seleccionó un método
      if (autoPay && metodo_pago) {
        // Delay slightly to allow modal render
        setTimeout(() => {
          handlePagar();
        }, 200);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, handledAutoOpen, metodo_pago]);

  const metodos_pago = [
    { id: "tarjeta", nombre: "Tarjeta", icono: CreditCard },
    { id: "efectivo", nombre: "Efectivo", icono: DollarSign },
    { id: "transferencia", nombre: "Transferencia", icono: Smartphone },
    { id: "wallet", nombre: "Wallet Digital", icono: Wallet },
  ];

  const handlePagar = async () => {
    // Si no está logueado, redireccionar al login con parámetro next para volver
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Debes iniciar sesión para continuar");
      // cerrar modal
      try {
        document.getElementById("modal-pago").close();
      } catch (e) {}

      // Guardar método de pago seleccionado (si hay) para recuperarlo después
      try {
        localStorage.setItem("pending_metodo_pago", metodo_pago || "");
      } catch (e) {}

      // Construir next: la ruta actual + abrir modal y pedir autoPay
      const currentPath = location.pathname + location.search;
      const sep = currentPath.includes("?") ? "&" : "?";
      const target = `${currentPath}${sep}openModal=1&autoPay=1`;
      const encoded = encodeURIComponent(target);
      navigate(`/login?next=${encoded}`);
      return;
    }

    if (!metodo_pago) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }

    // Crear el pedido
    const resultado = await crear_pedido({
      items: carrito_items,
      total: total,
      metodo_pago: metodo_pago,
    });

    if (!resultado || !resultado.success) {
      toast.error(resultado?.message || "No se pudo completar la compra");
      return;
    }

    toast.success("Compra realizada con éxito");
    onCompraExitosa();
    document.getElementById("modal-pago").close();
    set_metodo_pago("");
  };

  const abrirModal = () => {
    document.getElementById("modal-pago").showModal();
  };

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
                    metodo_pago === metodo.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="card-body items-center text-center p-6">
                    <metodo.icono
                      size={32}
                      className={
                        metodo_pago === metodo.id ? "text-primary" : ""
                      }
                    />
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
  );
}
