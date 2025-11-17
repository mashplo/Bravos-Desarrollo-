import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

//REGISTER
export const register = async (req, res) => {
  try {
    const { nombre, email, password, username } = req.body;

    // Validar datos mínimos
    if (!nombre || !email || !password || !username) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Validar email
    const exists = await User.findOne({ where: { correo: email } });
    if (exists) {
      return res.status(400).json({ message: "El correo ya existe" });
    }

    // Validar username
    const existsUser = await User.findOne({ where: { usuario: username } });
    if (existsUser) {
      return res.status(400).json({ message: "El username ya existe" });
    }

    // Crear usuario con los nombres correctos del modelo
    const user = await User.create({
      nombre_apellido: nombre,
      correo: email,
      usuario: username,
      password
    });

    return res.json({
      message: "Usuario registrado",
      user
    });

  } catch (error) {
    console.error(error); // agrégalo temporal para ver el error real
    return res.status(500).json({ message: "Error interno" });
  }
};


// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Buscar usuario por CORREO (nombre del modelo)
    const user = await User.findOne({ where: { correo: email } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña en texto plano
    if (user.password !== password) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar token --
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre_apellido,
        email: user.correo,
        username: user.usuario,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error); // Útil para ver errores en Railway
    return res.status(500).json({ message: "Error interno" });
  }
};

