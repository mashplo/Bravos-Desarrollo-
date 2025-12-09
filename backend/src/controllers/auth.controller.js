import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Función helper para comparar contraseñas
 * Soporta tanto contraseñas hasheadas (nuevas) como texto plano (migración)
 */
async function comparePassword(inputPassword, storedPassword) {
  // Si la contraseña almacenada parece ser un hash de bcrypt
  if (storedPassword.startsWith("$2")) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
  // Fallback para contraseñas legacy en texto plano (migración)
  return inputPassword === storedPassword;
}

/**
 * REGISTER - Registrar nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { nombre, email, password, username, deviceId, deviceType } = req.body;

    // La validación principal se hace en el middleware validateRegister
    // Esta es una validación de respaldo
    if (!nombre || !email || !password || !username) {
      return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
    }

    // Validar email único
    const exists = await User.findOne({ where: { correo: email } });
    if (exists) {
      return res.status(400).json({ success: false, message: "El correo ya existe" });
    }

    // Validar username único
    const existsUser = await User.findOne({ where: { usuario: username } });
    if (existsUser) {
      return res.status(400).json({ success: false, message: "El username ya existe" });
    }

    // Hash de contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear usuario
    const user = await User.create({
      nombre_apellido: nombre,
      correo: email,
      usuario: username,
      password: hashedPassword,
    });

    // Generar token JWT
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
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user.id,
        nombre: user.nombre_apellido,
        email: user.correo,
        username: user.usuario,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


/**
 * LOGIN - Iniciar sesión
 */
export const login = async (req, res) => {
  try {
    const { email, password, deviceId, deviceType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    // Buscar usuario por email
    const user = await User.findOne({ where: { correo: email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Comparar contraseña (soporta hash y legacy)
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
    }

    const finalDeviceId = deviceId || crypto.randomUUID();
    const finalDeviceType = deviceType || "web";

    // Verificar si hay sesiones activas en otros dispositivos
    const activeSessions = await Session.findAll({
      where: {
        user_id: user.id,
        is_active: true,
      },
    });

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
          activeSessions: activeSessions.map((s) => ({
            deviceType: s.device_type,
            lastActivity: s.last_activity,
          })),
        });
      }
    }

    // Generar nuevo token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Desactivar sesiones anteriores
    await Session.update({ is_active: false }, { where: { user_id: user.id } });

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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


/**
 * LOGIN WITH FORCE - Forzar login cerrando otras sesiones
 */
export const loginWithForce = async (req, res) => {
  try {
    const { email, password, deviceId, deviceType, forceLogin } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
    }

    if (!forceLogin) {
      return res.status(400).json({ success: false, message: "Se requiere confirmación" });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { correo: email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Comparar contraseña
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
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
    await Session.update({ is_active: false }, { where: { user_id: user.id } });

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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en force login:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


/**
 * LOGOUT - Cerrar sesión
 */
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
      await Session.update({ is_active: false }, { where: { user_id: userId } });
    }

    return res.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
  }
};
