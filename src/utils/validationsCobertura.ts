import { body, param, query } from "express-validator";

export const coberturaValidation = {
  // Validación para crear cobertura
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la cobertura es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la cobertura es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),

    body("recargoPorAtraso")
      .notEmpty()
      .withMessage("El recargoPorAtraso de la cobertura es requerida")
      .isFloat({ min: 1 })
      .withMessage("El recargo debe ser mayor a 1")
      .trim(),
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
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción del cobertura es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre del cobertura es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),

    body("recargoPorAtraso")
      .notEmpty()
      .withMessage("El recargoPorAtraso de la cobertura es requerida")
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
