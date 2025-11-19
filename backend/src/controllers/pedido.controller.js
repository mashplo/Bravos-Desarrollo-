import { Pedido } from "../models/pedido.model.js";
import { DetallePedido } from "../models/detalles_pedido.model.js";
import { Producto } from "../models/producto.model.js";

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

    // Guardar detalles de pedido (items)
    for (const item of items) {
      await DetallePedido.create({
        cantidad: item.cantidad,
        precio: item.precio,
        id_pedido: nuevoPedido.id,
        id_producto: item.id
      });
    }

    return res.status(201).json({ success: true, message: "Pedido creado", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error creando pedido:", error);
    return res.status(500).json({ success: false, message: "Error interno al crear pedido" });
  }
};

// Obtener todos los pedidos con detalles (para admin)
export const obtenerPedidosConDetalles = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    const pedidosConDetalles = [];
    for (const pedido of pedidos) {
      const detalles = await DetallePedido.findAll({ where: { id_pedido: pedido.id } });
      // Obtener info de producto para cada detalle
      const items = [];
      for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.id_producto);
        items.push({
          id: detalle.id_producto,
          name: producto?.nombre || "Producto",
          cantidad: detalle.cantidad,
          price: detalle.precio,
          image_url: producto?.image_url || "",
        });
      }
      pedidosConDetalles.push({
        id: pedido.id,
        fecha: pedido.fecha_hora,
        estado: pedido.estado,
        total: pedido.monto_total,
        metodo_pago: pedido.metodo_pago,
        items,
      });
    }
    return res.json(pedidosConDetalles);
  } catch (error) {
    console.error("Error obteniendo pedidos con detalles:", error);
    return res.status(500).json({ success: false, message: "Error interno al obtener pedidos" });
  }
};
