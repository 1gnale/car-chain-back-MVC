import { body, param, query } from "express-validator";

export const PeriodoPagoValidation = {
  // Validación para crear PeriodoPago
  create: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del PeriodoPago es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("cantidadMeses")
      .notEmpty()
      .withMessage("La cantidad de Meses del PeriodoPago es requerida")
      .isInt({ min: 1, max: 12 })
      .withMessage("La cantidad de Meses debe tener entre 1 y 12")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento del PeriodoPago es requerida")
      .isFloat({ min: 0 })
      .withMessage("El descuento debe tener entre 0 y 1000 caracteres")
      .trim(),
  ],
  // Validación para obtener por ID
  getById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del PeriodoPago es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("cantidadMeses")
      .notEmpty()
      .withMessage("La cantidad deMeses del PeriodoPago es requerida")
      .isInt({ min: 1, max: 12 })
      .withMessage("La cantidad de Meses debe tener entre 1 y 12")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento del PeriodoPago es requerida")
      .isFloat({ min: 0 })
      .withMessage("El descuento debe tener entre 0 y 1000 caracteres")
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
