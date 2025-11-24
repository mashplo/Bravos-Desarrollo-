import { User } from "../models/user.model.js";

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token via middleware

    const user = await User.findByPk(userId, {
      attributes: ['id', 'nombre_apellido', 'correo', 'usuario', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre_apellido,
        email: user.correo,
        username: user.usuario,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const { nombre, email, username, currentPassword, newPassword } = req.body;

    // Get current user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.correo) {
      const emailExists = await User.findOne({ 
        where: { correo: email } 
      });
      if (emailExists) {
        return res.status(400).json({ message: "El correo ya está en uso" });
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== user.usuario) {
      const usernameExists = await User.findOne({ 
        where: { usuario: username } 
      });
      if (usernameExists) {
        return res.status(400).json({ message: "El username ya está en uso" });
      }
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          message: "Debes proporcionar tu contraseña actual" 
        });
      }

      if (user.password !== currentPassword) {
        return res.status(400).json({ 
          message: "La contraseña actual es incorrecta" 
        });
      }

      // Update password
      user.password = newPassword;
    }

    // Update other fields
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
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};