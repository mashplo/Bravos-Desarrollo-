import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Función helper para comparar contraseñas
 * Soporta tanto contraseñas hasheadas como texto plano (migración)
 */
async function comparePassword(inputPassword, storedPassword) {
  if (storedPassword.startsWith("$2")) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
  return inputPassword === storedPassword;
}

/**
 * GET USER PROFILE - Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "nombre_apellido", "correo", "usuario", "role"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre_apellido,
        email: user.correo,
        username: user.usuario,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

/**
 * UPDATE USER PROFILE - Actualizar perfil del usuario
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, email, username, currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verificar email único si se está cambiando
    if (email && email !== user.correo) {
      const emailExists = await User.findOne({ where: { correo: email } });
      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: "El correo ya está en uso" });
      }
    }

    // Verificar username único si se está cambiando
    if (username && username !== user.usuario) {
      const usernameExists = await User.findOne({
        where: { usuario: username },
      });
      if (usernameExists) {
        return res
          .status(400)
          .json({ success: false, message: "El username ya está en uso" });
      }
    }

    // Si se quiere cambiar la contraseña
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Debes proporcionar tu contraseña actual",
        });
      }

      const isValidPassword = await comparePassword(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }

      // Hash de la nueva contraseña
      user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    // Actualizar otros campos
    if (nombre) user.nombre_apellido = nombre;
    if (email) user.correo = email;
    if (username) user.usuario = username;

    await user.save();

    return res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: {
        id: user.id,
        nombre: user.nombre_apellido,
        email: user.correo,
        username: user.usuario,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};
