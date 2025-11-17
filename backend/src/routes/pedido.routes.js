import { Router } from "express";
import { crearPedido } from "../controllers/pedido.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// POST /api/pedidos/  -> crear un pedido (requiere JWT)
router.post("/", verifyToken, crearPedido);

export default router;
