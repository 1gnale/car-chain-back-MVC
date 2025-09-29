import { body, param, query } from "express-validator";
import { ConfigLocalidad, Localidad } from "../models";

export const configLocalidadValidation = {
  // Validación para crear config Localidad
  create: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la Configuracion Localidad es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento de la Configuracion Localidad es requerida")
      .isInt({ min: 0 })
      .withMessage("El descuento debe ser mayor a 0")
      .trim(),
    body("ganancia")
      .notEmpty()
      .withMessage("La ganancia de la Configuracion Localidad es requerida")
      .isFloat({ min: 0 })
      .withMessage("La ganancia debe ser mayor a 0")
      .trim(),
    body("recargo")
      .notEmpty()
      .withMessage("El recargo de la Configuracion Localidad es requerida")
      .isFloat({ min: 0 })
      .withMessage("El recargo debe ser mayor a 0")
      .trim(),
  ],

  // Validación para obtener por ID
  getById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
  getByLocality: [
    param("localityId")
      .isInt({ min: 1 })
      .withMessage("El ID de la localidad debe ser un número entero positivo"),
  ],
  // Validación para modificar
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),

    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la Configuracion Localidad es requerida")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre debe tener entre 2 y 50 caracteres")
      .trim(),
    body("descuento")
      .notEmpty()
      .withMessage("El descuento de la Configuracion Localidad es requerida")
      .isInt({ min: 0 })
      .withMessage("El descuento debe ser mayor a 0")
      .trim(),
    body("ganancia")
      .notEmpty()
      .withMessage("La ganancia de la Configuracion Localidad es requerida")
      .isFloat({ min: 0 })
      .withMessage("La ganancia debe ser mayor a 0")
      .trim(),
    body("recargo")
      .notEmpty()
      .withMessage("El recargo de la Configuracion Localidad es requerida")
      .isFloat({ min: 0 })
      .withMessage("El recargo debe ser mayor a 0")
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
