import { body, param, query } from "express-validator";

export const provinciaValidation = {
  // Validación para crear provincia
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la provincia es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),
  ],

  // Validación para actualizar provincia
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la provincia es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),
  ],

  // Validación para obtener por ID
  getById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],

  // Validación para eliminar
  delete: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
};
