import { Resena } from "../models/resena.model.js";
import { User } from "../models/user.model.js";

export const listarResenas = async (req, res) => {
  try {
    const resenas = await Resena.findAll({ order: [["fecha", "DESC"]] });
    return res.json(resenas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
};

export const crearResena = async (req, res) => {
  try {
    const { comentario, calificacion } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Token requerido" });
    }

    if (!comentario || typeof calificacion === 'undefined') {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const usuario = await User.findByPk(user.id);
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const nueva = await Resena.create({
      usuario_id: usuario.id,
      nombre: usuario.nombre_apellido,
      comentario,
      calificacion,
    });

    return res.status(201).json({ success: true, message: "Reseña creada", resena: nueva });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
};
