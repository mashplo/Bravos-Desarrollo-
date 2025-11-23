import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/test", (req, res) => {
  res.json({ message: "✅ Backend funcionando!" });
});

export default router;
