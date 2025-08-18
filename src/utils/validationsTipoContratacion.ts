import { body, param, query } from "express-validator";

export const TipoContratacionValidation = {
  // Validación para crear TipoContratacion
  create: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del TipoContratacion es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("cantidadMeses")
      .notEmpty()
      .withMessage("La Cantidad de Meses del TipoContratacion es requerida")
      .isInt({ min: 1, max: 24 })
      .withMessage("La Cantidad de Meses debe tener entre 1 y 24")
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
      .withMessage("El nombre del TipoContratacion es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("cantidadMeses")
      .notEmpty()
      .withMessage("La cantidad deMeses del TipoContratacion es requerida")
      .isInt({ min: 1, max: 12 })
      .withMessage("La cantidad de Meses debe tener entre 1 y 12")
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
