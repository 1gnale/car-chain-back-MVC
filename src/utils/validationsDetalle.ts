import { body, param, query } from "express-validator";

export const detalleValidation = {
  // Validación para crear detalle
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción del detalle es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre del detalle es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),

    body("porcentaje_miles")
      .notEmpty()
      .withMessage("El porcentaje_miles del detalle es requerida")
      .isInt({ min: 1, max: 1000 })
      .withMessage("El procentaje debe tener entre 1 y 1000 caracteres")
      .trim(),

    body("monto_fijo")
      .notEmpty()
      .withMessage("El monto fijo es requerido")
      .isInt({ min: 0 })
      .withMessage("El el monto fijo debe ser de minimo 1")
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
      .withMessage("La descripción del detalle es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La descripción debe tener entre 2 y 100 caracteres")
      .trim(),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre del detalle es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),

    body("porcentaje_miles")
      .notEmpty()
      .withMessage("El nombre del detalle es requerida")
      .isInt({ min: 1, max: 1000 })
      .withMessage("El procentaje debe tener entre 1 y 1000 caracteres")
      .trim(),

    body("monto_fijo")
      .notEmpty()
      .withMessage("El monto fijo es requerido")
      .isInt({ min: 0 })
      .withMessage("El el monto fijo debe ser de minimo 1")
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
