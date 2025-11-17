import { Pedido } from "../models/pedido.model.js";

// Crear pedido (protegido por JWT en la ruta)
export const crearPedido = async (req, res) => {
  try {
    const { items, total, metodo_pago } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No hay items en el pedido" });
    }

    const nuevoPedido = await Pedido.create({
      fecha_hora: new Date(),
      estado: "en_preparacion",
      monto_total: total || 0,
      metodo_pago: metodo_pago || "no especificado",
      id_cliente: req.user?.id || null
    });

    // Nota: detalles de pedido (items) podrían guardarse en una tabla aparte.
    return res.status(201).json({ success: true, message: "Pedido creado", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error creando pedido:", error);
    return res.status(500).json({ success: false, message: "Error interno al crear pedido" });
  }
};
