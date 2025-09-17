import { body, param, query } from "express-validator";
import {
  Cliente,
  Cobertura,
  ConfigAntiguedad,
  ConfigEdad,
  ConfigLocalidad,
  Cotizacion,
  LineaCotizacion,
  Persona,
  Vehiculo,
  Version,
} from "../models";

export const VehiculoCotizacionValidation = {
  // HU9.1 --- El backend debe ser capaz de guardar los datos del vehiculo
  createVehicle: [
    body("mail")
      .isEmail()
      .withMessage("El correo del cliente debe ser un correo válido")
      .custom(async (value) => {
        const cliente = await Cliente.findOne({
          include: [{ model: Persona, as: "persona", where: { correo: value } }],
        });
        if (!cliente) {
          throw new Error("El cliente indicada no existe");
        }
        return true;
      }),
    body("version_id")
      .isInt({ min: 1 })
      .withMessage("El ID de la version debe ser un número entero positivo")
      .custom(async (value) => {
        const version = await Version.findByPk(value);
        if (!version) {
          throw new Error("La version indicada no existe");
        }
        return true;
      }),
    body("matricula")
      .notEmpty()
      .withMessage("El Matricula es obligatoria")
      .isLength({ min: 6, max: 50 })
      .withMessage("La matricula debe tener mas de 6 caracteres"),
    body("añoFabricacion")
      .isInt({ min: 1900 })
      .withMessage("El año debe ser un número entero positivo de mayor a 1900"),
    body("numeroMotor")
      .isInt({ min: 1 })
      .withMessage(
        "El num del motor debe ser un número entero positivo de mayor a 1"
      ),
    body("chasis")
      .notEmpty()
      .withMessage("El chasis es obligatoria")
      .isLength({ min: 12, max: 20 })
      .withMessage("El chasis debe tener mas de 12 caracteres"),
    body("gnc")
      .notEmpty()
      .withMessage("El valor de 'gnc' es requerido")
      .isBoolean()
      .withMessage("El valor de 'gnc' debe ser verdadero o falso")
      .toBoolean(),
  ],

  //HU9.1  --- El backend debe verificar que no haya una poliza o cotizacion con la matricula del vehiculo ingresado.
  verifyMatricula: [
    param("matricula")
      .notEmpty()
      .withMessage("El Matricula es obligatoria")
      .isLength({ min: 6, max: 50 })
      .withMessage("La matricula debe tener mas de 6 caracteres")
      .custom(async (value) => {
        const vehiculo = await Vehiculo.findOne({ where: { matricula: value } });
        if (vehiculo) {
          throw new Error("Ya existe un vehiculo con esa matricula");
        }
        return true;
      }),
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
  //HU9.1 --- El backend debe ser capaz de guardar los datos de la cotizacion.
  createCotizacion: [
    body("vehiculo_id")
      .notEmpty()
      .withMessage("El valor del vehiculo_id es requerido")
      .isInt({ min: 1 })
      .withMessage("El ID del vehiculo debe ser un número entero positivo")
      .custom(async (value) => {
        const vehiculo = await Vehiculo.findByPk(value);
        if (!vehiculo) {
          throw new Error("El vehiculo indicado no existe");
        }
        return true;
      }),
    body("configuracionLocalidad_id")
      .notEmpty()
      .withMessage("El valor de configuracion localidad es requerido")
      .isInt({ min: 1 })
      .withMessage(
        "El ID de la configuracion Localidad debe ser un número entero positivo"
      )
      .custom(async (value) => {
        const configLocalidad = await ConfigLocalidad.findByPk(value);
        if (!configLocalidad) {
          throw new Error("La configLocalidad indicada no existe");
        }
        return true;
      }),
    body("configuracionEdad_id")
      .notEmpty()
      .withMessage("El valor de configuracion edad es requerido")
      .isInt({ min: 1 })
      .withMessage(
        "El ID de la configuracion edad debe ser un número entero positivo"
      )
      .custom(async (value) => {
        const configEdad = await ConfigEdad.findByPk(value);
        if (!configEdad) {
          throw new Error("La configEdad indicada no existe");
        }
        return true;
      }),
    body("configuracionAntiguedad_id")
      .notEmpty()
      .withMessage("El valor de configuracion antiguedad es requerido")
      .isInt({ min: 1 })
      .withMessage(
        "El ID de la configuracion antiguedad debe ser un número entero positivo"
      )
      .custom(async (value) => {
        const configAntiguedad = await ConfigAntiguedad.findByPk(value);
        if (!configAntiguedad) {
          throw new Error("La configAntiguedad indicada no existe");
        }
        return true;
      }),
    body("fechaCreacion")
      .notEmpty()
      .withMessage("La fechaCreacion es obligatoria"),
    body("fechaVencimiento")
      .notEmpty()
      .withMessage("La fechaVencimiento es obligatoria"),
  ],
  // HU9.1 --- El backend debe ser capaz de guardar los datos de la lineaCotizacion.
  createLineaCotizacion: [
    body("monto")
      .isFloat({ min: 1 })
      .withMessage("El monto debe ser un numero mayor a 1"),

    body("cotizacion_id")
      .isInt({ min: 1 })
      .withMessage("El ID de la cotizacion debe ser un número entero positivo")
      .custom(async (value) => {
        const cotizacion = await Cotizacion.findByPk(value);
        if (!cotizacion) {
          throw new Error("La cotizacion indicada no existe");
        }
        return true;
      }),

    body("cobertura_id")
      .isInt({ min: 1 })
      .withMessage("El ID de la cobertura debe ser un número entero positivo")
      .custom(async (value) => {
        const cobertura = await Cobertura.findByPk(value);
        if (!cobertura) {
          throw new Error("La cobertura indicada no existe");
        }
        return true;
      })
      .custom(async (value, { req }) => {
        // verificamos si la combinación ya existe
        const existe = await LineaCotizacion.findOne({
          where: {
            cobertura_id: value,
            cotizacion_id: req.body.cotizacion_id, // usamos el id enviado
          },
        });

        if (existe) {
          throw new Error(
            "Ya existe una línea de cotización con esa cobertura para la misma cotización"
          );
        }
        return true;
      }),
  ],

  // HU10 --- El backend debe ser capaz de devolver una lista de todas las cotizaciones del cliente.
  getCotizacionesByClientId: [
    param("mail")
      .isEmail()
      .withMessage("El mail debe ser un correo electrónico válido"),
  ],

  getLineasCotizacionByCotizacionId: [
    param("cotizacion_id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
};
