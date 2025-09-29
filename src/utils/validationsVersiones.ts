import { body, param, query } from "express-validator";
import { Marca, Modelo } from "../models";

export const versionValidation = {
  // Validación para crear la version
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la version es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La version debe tener entre 2 y 100 caracteres")
      .trim(),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la version es requerido")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre de la version debe tener entre 2 y 50 caracteres")
      .trim(),
    body("precio_mercado")
      .notEmpty()
      .withMessage("el precio_mercado es requerido")
      .isFloat()
      .withMessage("El precio_mercado debe ser un numero flotante"),

    body("precio_mercado_gnc")
      .notEmpty()
      .withMessage("el precio_mercado_gnc es requerido")
      .isFloat()
      .withMessage("El precio_mercado_gnc debe ser un numero flotante"),
    body("modelo")
      .notEmpty()
      .withMessage("El modelo es requerido")
      .custom(async (value) => {
        const model = await Modelo.findByPk(value.id);
        if (!model) {
          throw new Error("El modelo indicado no existe");
        }
        return true;
      }),
  ],

  // Validación para actualizar la version
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de la version es requerida")
      .isLength({ min: 2, max: 100 })
      .withMessage("La version debe tener entre 2 y 100 caracteres")
      .trim(),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre de la version es requerido")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre de la version debe tener entre 2 y 50 caracteres")
      .trim(),
    body("precio_mercado")
      .notEmpty()
      .withMessage("el precio_mercado es requerido")
      .isFloat()
      .withMessage("El precio_mercado debe ser un numero flotante"),

    body("precio_mercado_gnc")
      .notEmpty()
      .withMessage("el precio_mercado_gnc es requerido")
      .isFloat()
      .withMessage("El precio_mercado_gnc debe ser un numero flotante"),
    body("modelo")
      .notEmpty()
      .withMessage("El modelo es requerido")
      .custom(async (value) => {
        const model = await Modelo.findByPk(value.id);
        if (!model) {
          throw new Error("El modelo indicado no existe");
        }
        return true;
      }),
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
