import { Pedido } from "../models/pedido.model.js";
import { DetallePedido } from "../models/detalles_pedido.model.js";
import { Producto } from "../models/producto.model.js";

// Catálogo estático (coincide con el frontend `herramientas/productos.js`)
const PRODUCT_CATALOG = [
  // Hamburguesas
  { id: 0, name: "Smash Burguer", image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" },
  { id: 1, name: "Bacon Burguer", image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80" },
  { id: 2, name: "Doble Carne", image_url: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80" },
  { id: 3, name: "Americana", image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80" },
  { id: 4, name: "Carnívora", image_url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=80" },
  { id: 5, name: "Cheese Burguer", image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80" },
  // Bebidas (IDs deben coincidir con los del frontend)
  { id: 6, name: "Coca cola", image_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80" },
  { id: 7, name: "Inka cola", image_url: "https://mir-s3-cdn-cf.behance.net/projects/404/069e01209605969.Y3JvcCw0MjI1LDMzMDUsOTYyLDA.gif" },
  { id: 8, name: "Pepsi", image_url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&auto=format&fit=crop&q=80" },
  { id: 9, name: "Jugo de Fresa", image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80" },
  { id: 10, name: "Jugo de Mango", image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80" },
  { id: 11, name: "Jugo de Piña", image_url: "https://media.istockphoto.com/id/178035953/es/foto/preparados-jugo-de-pi%C3%B1a.jpg?s=612x612&w=0&k=20&c=Ugq7N5exScyAuCLm_Sc0FvSOJlpZlV7n_Y_eby2Iark=" },
];

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
      id_cliente: req.user?.id || null,
    });

    // Guardar detalles de pedido (items)
    // Aceptamos tanto `item.precio` como `item.price` desde el frontend.
    // Además construimos la respuesta con `name` e `image_url` tomando como
    // prioridad lo que envía el frontend o el catálogo estático.
    const detalles = items.map((item) => ({
      cantidad: item.cantidad || item.qty || 1,
      precio: item.precio ?? item.price ?? 0,
      id_pedido: nuevoPedido.id,
      id_producto: item.id,
    }));

    // Usar bulkCreate para eficiencia y evitar errores por campos undefined
    await DetallePedido.bulkCreate(detalles);

    // Construir items enriquecidos para la respuesta (nombre + image_url)
    const enrichedItems = items.map((item, idx) => {
      const catalog = PRODUCT_CATALOG.find((p) => Number(p.id) === Number(item.id));
      return {
        id: item.id,
        name: item.name || catalog?.name || `Producto ${item.id}`,
        cantidad: item.cantidad || item.qty || 1,
        price: item.precio ?? item.price ?? 0,
        image_url: item.image_url || catalog?.image_url || "",
      };
    });

    // Devolver el pedido creado junto con detalles enriquecidos
    return res.status(201).json({
      success: true,
      message: "Pedido creado",
      pedido: {
        id: nuevoPedido.id,
        fecha: nuevoPedido.fecha_hora,
        estado: nuevoPedido.estado,
        total: nuevoPedido.monto_hola || nuevoPedido.monto_total || nuevoPedido.monto_total,
        metodo_pago: nuevoPedido.metodo_pago,
        items: enrichedItems,
      },
    });
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
        // fallback to catalog if producto not found or missing image
        const catalog = PRODUCT_CATALOG.find((p) => Number(p.id) === Number(detalle.id_producto));
        items.push({
          id: detalle.id_producto,
          name: producto?.nombre || catalog?.name || "Producto",
          cantidad: detalle.cantidad,
          price: detalle.precio,
          image_url: producto?.image_url || catalog?.image_url || "",
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

// Borrar todos los pedidos entregados (solo admin)
export const borrarPedidosEntregados = async (req, res) => {
  try {
    // Eliminar detalles primero por integridad referencial
    const entregados = await Pedido.findAll({ where: { estado: 'entregado' } });
    const ids = entregados.map(p => p.id);
    if (ids.length > 0) {
      await DetallePedido.destroy({ where: { id_pedido: ids } });
      await Pedido.destroy({ where: { id: ids } });
    }
    return res.json({ success: true, message: 'Pedidos entregados borrados', deleted: ids.length });
  } catch (error) {
    console.error('Error borrando pedidos entregados:', error);
    return res.status(500).json({ success: false, message: 'Error interno al borrar pedidos entregados' });
  }
};

// Actualizar estado del pedido por id
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevo_estado } = req.body;
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: "Pedido no encontrado" });
    }
    pedido.estado = nuevo_estado;
    await pedido.save();
    return res.json({ success: true, message: "Estado actualizado", pedido });
  } catch (error) {
    console.error("Error actualizando estado del pedido:", error);
    return res.status(500).json({ success: false, message: "Error interno al actualizar estado" });
  }
};
