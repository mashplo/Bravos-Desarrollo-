import jwt from "jsonwebtoken";
import { Session } from "../models/session.model.js";

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar que la sesión esté activa en la base de datos
    const session = await Session.findOne({
      where: {
        user_id: data.id,
        token: token,
        is_active: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        message:
          "Sesión expirada o cerrada. Por favor inicia sesión nuevamente.",
        sessionExpired: true,
      });
    }

    // Actualizar última actividad
    await session.update({ last_activity: new Date() });

    req.user = data;
    req.session = session;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

/**
 * Middleware para verificar que el usuario sea administrador
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Se requieren permisos de administrador.",
    });
  }
  next();
}

// Alias para compatibilidad
export const authMiddleware = verifyToken;
