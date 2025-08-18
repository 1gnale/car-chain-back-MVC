import { body, param, query } from "express-validator";
import { Marca, Modelo } from "../models";

export const modeloValidation = {
  // Validación para crear modelo
  create: [
    body("descripcion")
      .notEmpty()
      .withMessage("La descripción de modelo es requerido")
      .isLength({ min: 2, max: 100 })
      .withMessage("El modelo debe tener entre 2 y 100 caracteres")
      .trim(),
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del modelo es requerido")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre del modelo debe tener entre 2 y 50 caracteres")
      .trim(),
    body("marca_id")
      .notEmpty()
      .withMessage("La marca es requerida")
      .isInt()
      .withMessage("La marca debe ser un número entero")
      .custom(async (value) => {
        const marca = await Marca.findByPk(value);
        if (!marca) {
          throw new Error("La marca indicada no existe");
        }
        return true;
      }),
  ],

  // Validación para actualizar modelo
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
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del modelo es requerido")
      .isLength({ min: 2, max: 50 })
      .withMessage("El nombre del modelo debe tener entre 2 y 50 caracteres")
      .trim(),
    body("marca_id")
      .notEmpty()
      .withMessage("La marca es requerida")
      .isInt()
      .withMessage("La marca debe ser un número entero")
      .custom(async (value) => {
        const marca = await Marca.findByPk(value);
        if (!marca) {
          throw new Error("La marca indicada no existe");
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