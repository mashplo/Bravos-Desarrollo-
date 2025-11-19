import { Router } from "express";
import { crearPedido, obtenerPedidosConDetalles } from "../controllers/pedido.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// POST /api/pedidos/  -> crear un pedido (requiere JWT)
router.post("/", verifyToken, crearPedido);

// GET /api/pedidos/  -> obtener todos los pedidos con detalles (requiere JWT)
router.get("/", verifyToken, obtenerPedidosConDetalles);

export default router;
