import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password, direccion } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }

        const existente = await User.findOne({ where: { email } });
        if (existente) {
            return res.status(400).json({ success: false, message: "El email ya está registrado" });
        }

        const nuevo = await User.create({
            nombre,
            email,
            password,   // no encriptado por ahora
            direccion
        });

        return res.json({
            success: true,
            message: "Usuario registrado exitosamente",
            usuario: nuevo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error interno" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    // ADMIN HARDCODEADO (igual que tu front)
    if (email === "esaul@gmail.com" && password === "contra123") {
        return res.json({
            success: true,
            message: "Sesión iniciada exitosamente",
            usuario: {
                id: 0,
                nombre: "Administrador",
                email,
                es_admin: true
            },
            es_admin: true
        });
    }

    const user = await User.findOne({ where: { email, password } });
    if (!user) {
        return res.status(400).json({ success: false, message: "Email o contraseña incorrectos" });
    }

    return res.json({
        success: true,
        message: "Sesión iniciada exitosamente",
        usuario: user,
        es_admin: false
    });
});


export default router;
