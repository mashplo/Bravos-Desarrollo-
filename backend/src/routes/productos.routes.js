import { Router } from "express";
import {
  PRODUCTOS,
  getProductoById,
  getHamburguesas,
  getBebidas,
} from "../data/productos.js";

const router = Router();

/**
 * GET /api/productos - Obtener todos los productos
 * Query params: ?category=hamburguesas|bebidas
 */
router.get("/", (req, res) => {
  const { category } = req.query;

  if (category) {
    const filtered = PRODUCTOS.filter((p) => p.category === category);
    return res.json({ success: true, productos: filtered });
  }

  res.json({ success: true, productos: PRODUCTOS });
});

/**
 * GET /api/productos/hamburguesas - Obtener solo hamburguesas
 */
router.get("/hamburguesas", (req, res) => {
  res.json({ success: true, productos: getHamburguesas() });
});

/**
 * GET /api/productos/bebidas - Obtener solo bebidas
 */
router.get("/bebidas", (req, res) => {
  res.json({ success: true, productos: getBebidas() });
});

/**
 * GET /api/productos/:id - Obtener producto por ID
 */
router.get("/:id", (req, res) => {
  const producto = getProductoById(req.params.id);
  if (!producto) {
    return res.status(404).json({
      success: false,
      message: "Producto no encontrado",
    });
  }
  res.json({ success: true, producto });
});

export default router;
