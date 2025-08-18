import { body, param, query } from "express-validator";

export const configAntiguedadValidation = {
  // Validación para crear Config Antiguedad
  create: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la Configuracion Antiguedad es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("minima")
      .notEmpty()
      .withMessage("El minima de la Configuracion Antiguedad es requerida")
      .isInt({ min: 0 })
      .withMessage("El minima debe ser mayor a 0")
      .trim(),
    body("maxima")
      .notEmpty()
      .withMessage("La maxima de la Configuracion Antiguedad es requerida")
      .isInt({ min: 1 })
      .withMessage("La maxima debe ser mayor a 1")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento de la Configuracion Antiguedad es requerida")
      .isInt({ min: 1 })
      .withMessage("El descuento debe ser mayor a 1")
      .trim(),
    body("ganancia")
      .notEmpty()
      .withMessage("La ganancia de la Configuracion Antiguedad es requerida")
      .isFloat({ min: 1 })
      .withMessage("La ganancia debe ser mayor a 1")
      .trim(),
    body("recargo")
      .notEmpty()
      .withMessage("El recargo de la Configuracion Antiguedad es requerida")
      .isFloat({ min: 1 })
      .withMessage("El recargo debe ser mayor a 1")
      .trim(),
  ],
  getByAge: [
    param("age")
      .isInt({ min: 0 })
      .withMessage("La antiguedad debe ser un número entero positivo"),
  ],
  // Validación para obtener por ID
  getById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],

  // Validación para modificar
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la Configuracion Antiguedad es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("minima")
      .notEmpty()
      .withMessage("El minima de la Configuracion Antiguedad es requerida")
      .isInt({ min: 0 })
      .withMessage("El minima debe ser mayor a 0")
      .trim(),
    body("maxima")
      .notEmpty()
      .withMessage("La maxima de la Configuracion Antiguedad es requerida")
      .isInt({ min: 1 })
      .withMessage("La maxima debe ser mayor a 1")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento de la Configuracion Antiguedad es requerida")
      .isInt({ min: 1 })
      .withMessage("El descuento debe ser mayor a 1")
      .trim(),
    body("ganancia")
      .notEmpty()
      .withMessage("La ganancia de la Configuracion Antiguedad es requerida")
      .isFloat({ min: 1 })
      .withMessage("La ganancia debe ser mayor a 1")
      .trim(),
    body("recargo")
      .notEmpty()
      .withMessage("El recargo de la Configuracion Antiguedad es requerida")
      .isFloat({ min: 1 })
      .withMessage("El recargo debe ser mayor a 1")
      .trim(),
    body("activo")
      .notEmpty()
      .withMessage("El valor de 'activo' es requerido")
      .isBoolean()
      .withMessage("El valor de 'activo' debe ser verdadero o falso")
      .toBoolean(),
  ],

  delete: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
};
