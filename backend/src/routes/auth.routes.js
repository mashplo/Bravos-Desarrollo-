import { Router } from "express";
import {
  register,
  login,
  loginWithForce,
  logout,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validateRegister, validateLogin } from "../validators/index.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/login/force", validateLogin, loginWithForce);
router.post("/logout", authMiddleware, logout);

// Endpoint para verificar si la sesión sigue activa
router.get("/verify-session", authMiddleware, (req, res) => {
  res.json({
    success: true,
    valid: true,
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});

router.get("/test", (req, res) => {
  res.json({ message: "✅ Backend funcionando!" });
});

export default router;
