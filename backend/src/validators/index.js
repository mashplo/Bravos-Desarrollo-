import { body, validationResult } from "express-validator";

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/**
 * Validación para registro de usuario
 */
export const validateRegister = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El username es requerido")
    .isLength({ min: 3, max: 30 })
    .withMessage("El username debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("El username solo puede contener letras, números y guión bajo"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

/**
 * Validación para login
 */
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  handleValidationErrors,
];

/**
 * Validación para crear pedido
 */
export const validatePedido = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un item"),
  body("items.*.id")
    .notEmpty()
    .withMessage("Cada item debe tener un ID")
    .isInt({ min: 0 })
    .withMessage("ID de producto inválido"),
  body("total")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El total debe ser un número positivo"),
  body("metodo_pago")
    .optional()
    .isString()
    .withMessage("Método de pago inválido"),
  handleValidationErrors,
];

/**
 * Validación para crear reseña
 */
export const validateResena = [
  body("comentario")
    .trim()
    .notEmpty()
    .withMessage("El comentario es requerido")
    .isLength({ min: 5, max: 500 })
    .withMessage("El comentario debe tener entre 5 y 500 caracteres"),
  body("calificacion")
    .notEmpty()
    .withMessage("La calificación es requerida")
    .isInt({ min: 1, max: 5 })
    .withMessage("La calificación debe ser entre 1 y 5"),
  handleValidationErrors,
];

/**
 * Validación para actualizar perfil
 */
export const validateProfileUpdate = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El username debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("El username solo puede contener letras, números y guión bajo"),
  body("newPassword")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];
