import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

//REGISTER
export const register = async (req, res) => {
  try {
    const { nombre, email, password, username, deviceId, deviceType } = req.body;

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

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Crear sesión inicial
    const finalDeviceId = deviceId || crypto.randomUUID();
    const finalDeviceType = deviceType || "web";

    await Session.create({
      user_id: user.id,
      device_id: finalDeviceId,
      device_type: finalDeviceType,
      token: token,
      is_active: true,
      last_activity: new Date(),
    });

    return res.json({
      success: true,
      message: "Usuario registrado",
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
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};


// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, password, deviceId, deviceType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // Buscar usuario por CORREO
    const user = await User.findOne({ where: { correo: email } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    if (user.password !== password) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const finalDeviceId = deviceId || crypto.randomUUID();
    const finalDeviceType = deviceType || "web";

    // Verificar si hay sesiones activas
    const activeSessions = await Session.findAll({
      where: {
        user_id: user.id,
        is_active: true,
      },
    });

    // Si hay sesiones activas en otros dispositivos
    if (activeSessions.length > 0) {
      const currentDeviceSession = activeSessions.find(
        (s) => s.device_id === finalDeviceId
      );

      // Si no es el mismo dispositivo, requiere confirmación
      if (!currentDeviceSession) {
        return res.status(409).json({
          success: false,
          requireConfirmation: true,
          message: "Tu cuenta está activa en otro dispositivo. ¿Deseas continuar aquí y cerrar la otra sesión?",
          activeSessions: activeSessions.map(s => ({
            deviceType: s.device_type,
            lastActivity: s.last_activity
          }))
        });
      }
    }

    // Generar nuevo token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Desactivar todas las sesiones anteriores
    await Session.update(
      { is_active: false },
      { where: { user_id: user.id } }
    );

    // Crear nueva sesión
    await Session.create({
      user_id: user.id,
      device_id: finalDeviceId,
      device_type: finalDeviceType,
      token: token,
      is_active: true,
      last_activity: new Date(),
    });

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
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};


// --- LOGIN CON CONFIRMACIÓN (FORZAR CIERRE DE OTRAS SESIONES) ---
export const loginWithForce = async (req, res) => {
  try {
    const { email, password, deviceId, deviceType, forceLogin } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    if (!forceLogin) {
      return res.status(400).json({ message: "Se requiere confirmación" });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { correo: email } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña
    if (user.password !== password) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const finalDeviceId = deviceId || crypto.randomUUID();
    const finalDeviceType = deviceType || "web";

    // Generar nuevo token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Desactivar TODAS las sesiones anteriores
    await Session.update(
      { is_active: false },
      { where: { user_id: user.id } }
    );

    // Crear nueva sesión
    await Session.create({
      user_id: user.id,
      device_id: finalDeviceId,
      device_type: finalDeviceType,
      token: token,
      is_active: true,
      last_activity: new Date(),
    });

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
    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
};


// --- LOGOUT ---
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deviceId } = req.body;

    if (deviceId) {
      // Cerrar sesión específica del dispositivo
      await Session.update(
        { is_active: false },
        {
          where: {
            user_id: userId,
            device_id: deviceId,
          },
        }
      );
    } else {
      // Cerrar todas las sesiones del usuario
      await Session.update(
        { is_active: false },
        { where: { user_id: userId } }
      );
    }

    return res.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};
