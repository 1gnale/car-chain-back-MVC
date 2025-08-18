import { body, param, query } from "express-validator";
import { Cobertura, CoberturaDetalle, Detalle } from "../models";

export const coberturaDetalleValidation = {
  // Validación para crear coberturaDetalle
  create: [
    body("cobertura_id")
      .notEmpty()
      .withMessage("La cobertura es requerida")
      .isInt()
      .withMessage("La cobertura debe ser un número entero")
      .custom(async (value) => {
        const cobertura = await Cobertura.findByPk(value);
        if (!cobertura) {
          throw new Error("La cobertura indicada no existe");
        }
        return true;
      })
      .custom(async (value, { req }) => {
        const fk2 = req.body.detalle_id;

        // chequear en la base si ya existe esa combinación
        const existe = await CoberturaDetalle.findOne({
          where: { cobertura_id: value, detalle_id: fk2 },
        });

        if (existe) {
          throw new Error("La relación con esos valores ya existe");
        }

        return true;
      }),

    body("detalle_id")
      .notEmpty()
      .withMessage("El detalle es requerido")
      .isInt()
      .withMessage("El detalle debe ser un número entero")
      .custom(async (value) => {
        const detalle = await Detalle.findByPk(value);
        if (!detalle) {
          throw new Error("El detalle indicada no existe");
        }
        return true;
      }),
    body("aplica")
      .notEmpty()
      .withMessage("El valor de 'aplica' es requerido")
      .isBoolean()
      .withMessage("El valor de 'aplica' debe ser verdadero o falso")
      .toBoolean(),
  ],

  // Validación para modificar
  update: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
    body("cobertura_id")
      .notEmpty()
      .withMessage("La cobertura es requerida")
      .isInt()
      .withMessage("La cobertura debe ser un número entero")
      .custom(async (value) => {
        const cobertura = await Cobertura.findByPk(value);
        if (!cobertura) {
          throw new Error("La cobertura indicada no existe");
        }
        return true;
      }),

    body("detalle_id")
      .notEmpty()
      .withMessage("El detalle es requerido")
      .isInt()
      .withMessage("El detalle debe ser un número entero")
      .custom(async (value) => {
        const detalle = await Detalle.findByPk(value);
        if (!detalle) {
          throw new Error("El detalle indicada no existe");
        }
        return true;
      }),
    body("aplica")
      .notEmpty()
      .withMessage("El valor de 'aplica' es requerido")
      .isBoolean()
      .withMessage("El valor de 'aplica' debe ser verdadero o falso")
      .toBoolean(),
  ],
};
