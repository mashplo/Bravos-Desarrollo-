import { Router } from "express";
import {
  listarResenas,
  crearResena,
} from "../controllers/resena.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { validateResena } from "../validators/index.js";

const router = Router();

router.get("/", listarResenas);
router.post("/", verifyToken, validateResena, crearResena);

export default router;
