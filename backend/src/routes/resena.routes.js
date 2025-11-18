import { Router } from "express";
import { listarResenas, crearResena } from "../controllers/resena.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarResenas);
router.post("/", verifyToken, crearResena);

export default router;
