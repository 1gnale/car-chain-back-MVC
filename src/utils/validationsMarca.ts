import { body, param, query } from "express-validator";

export const marcaValidation = {
  // Validación para crear marca
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la marca es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la marca es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
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
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la marca es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la marca es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
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
