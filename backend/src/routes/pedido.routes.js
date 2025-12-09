import { Router } from "express";
import {
  crearPedido,
  obtenerPedidosConDetalles,
  actualizarEstadoPedido,
  borrarPedidosEntregados,
  obtenerHistorialCliente,
  reiniciarContadorPedidos,
} from "../controllers/pedido.controller.js";
import { verifyToken, requireAdmin } from "../middlewares/auth.js";
import { validatePedido } from "../validators/index.js";

const router = Router();

// POST /api/pedidos/ -> crear un pedido (requiere JWT + validación)
router.post("/", verifyToken, validatePedido, crearPedido);

// GET /api/pedidos/ -> obtener todos los pedidos (SOLO ADMIN)
router.get("/", verifyToken, requireAdmin, obtenerPedidosConDetalles);

// GET /api/pedidos/historial -> obtener historial del cliente autenticado
router.get("/historial", verifyToken, obtenerHistorialCliente);

// PUT /api/pedidos/:id/estado -> actualizar estado (SOLO ADMIN)
router.put("/:id/estado", verifyToken, requireAdmin, actualizarEstadoPedido);

// DELETE /api/pedidos/entregados -> borrar pedidos entregados (SOLO ADMIN)
router.delete(
  "/entregados",
  verifyToken,
  requireAdmin,
  borrarPedidosEntregados
);

// POST /api/pedidos/reset-counter -> reiniciar contador (SOLO ADMIN)
router.post(
  "/reset-counter",
  verifyToken,
  requireAdmin,
  reiniciarContadorPedidos
);

export default router;
