import { body, param, query } from "express-validator";
import Poliza, { EstadoPoliza } from "../models/Poliza";
import {
  Documentacion,
  LineaCotizacion,
  PeriodoPago,
  TipoContratacion,
  Usuario,
} from "../models";
import { EstadoRevision } from "../models/Revision";
import { EstadoSiniestro } from "../models/Siniestro";

export const PolizaValidation = {
  // HU 9.2 --- El backend debe ser capaz de obtener la documentación de la póliza.
  getDocumentacionById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],

  // HU 9.2  --- El backend debe ser capaz de guardar la póliza con estado "Pendiente"
  createPoliza: [
    body("documentacion_id")
      .notEmpty()
      .withMessage("El documentacion_id es obligatorio")
      .isInt()
      .withMessage("El documentacion_id debe ser un número entero")
      .custom(async (value) => {
        const documentacion = await Documentacion.findByPk(value);
        if (!documentacion) {
          throw new Error("La documentacion indicada no existe");
        }
        return true;
      }),
    body("lineaCotizacion_id")
      .notEmpty()
      .withMessage("El lineaCotizacion_id es obligatorio")
      .isInt()
      .withMessage("El lineaCotizacion_id debe ser un número entero")
      .custom(async (value) => {
        const lineaCotizacion = await LineaCotizacion.findByPk(value);
        if (!lineaCotizacion) {
          throw new Error("La lineaCotizacion indicada no existe");
        }
        return true;
      }),
  ],
  // HU 11/12 --- El backend debe ser capaz de cambiar el estadoPoliza a aprobado, rechazado o en revision (La enumeracion).
  updatePolizaState: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),

    body("estadoPoliza")
      .notEmpty()
      .withMessage("El estadoPoliza de la poliza es requerida")
      .isIn(Object.values(EstadoPoliza))
      .withMessage(
        `El estado de la póliza debe ser uno de: ${Object.values(
          EstadoPoliza
        ).join(", ")}`
      ),
  ],
  // HU 11 --- El backend debe asignar al empleado que cambio el estado de la poliza a la poliza
  updateUsuarioPoliza: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
    body("usuario_legajo")
      .notEmpty()
      .withMessage("El usuario_legajo es obligatorio")
      .isInt()
      .withMessage("El usuario_legajo debe ser un número entero")
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          throw new Error("El usuario indicado no existe");
        }
        return true;
      }),
  ],
  /// HU 11/12/18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una poliza en especifico (Datos de la poliza a traer: Todos).
  getPolizaById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
  // HU 12 --- El backend debe ser capaz guardar una revision.
  createRevision: [
    body("usuario_legajo")
      .notEmpty()
      .withMessage("El usuario_legajo es obligatorio")
      .isInt()
      .withMessage("El usuario_legajo debe ser un número entero")
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          throw new Error("El usuario indicado no existe");
        }
        return true;
      }),
    body("poliza_numero")
      .notEmpty()
      .withMessage("El poliza_numero es obligatorio")
      .isInt()
      .withMessage("El poliza_numero debe ser un número entero")
      .custom(async (value) => {
        const poliza = await Poliza.findByPk(value);
        if (!poliza) {
          throw new Error("La poliza indicada no existe");
        }
        return true;
      }),
    body("fecha").notEmpty().withMessage("La fecha es obligatoria"),
    body("hora").notEmpty().withMessage("La hora es obligatoria"),
    body("estado")
      .notEmpty()
      .withMessage("El estado de la revision es requerida")
      .isIn(Object.values(EstadoRevision))
      .withMessage(
        `El estado de la póliza debe ser uno de: ${Object.values(
          EstadoRevision
        ).join(", ")}`
      ),
  ],
  // HU 18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una lista de todas las polizas del cliente (Datos de poliza a traer: N° Poliza, cobertura, fecha de contratacion, hora de contracion, estado).
  getAllPolizasByClientID: [
    param("idClient")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],

  // HU 18.1 --- El backend debe ser capaz de guardar los datos el siniestro con estado "Pendiente"
  createSiniestro: [
    body("poliza_numero")
      .notEmpty()
      .withMessage("El poliza_numero es obligatorio")
      .isInt()
      .withMessage("El poliza_numero debe ser un número entero")
      .custom(async (value) => {
        const poliza = await Poliza.findByPk(value);
        if (!poliza) {
          throw new Error("La poliza indicada no existe");
        }
        return true;
      }),
    body("horaSiniestro")
      .notEmpty()
      .withMessage("La horaSiniestro es obligatoria"),
    body("fechaSiniestro")
      .notEmpty()
      .withMessage("La fechaSiniestro es obligatoria"),
  ],
  // HU 18.3 --- El backend debe ser capaz de devolver una lista de pagos de una póliza especifica (Datos de pagos: Todos).
  getAllPagosPoliza: [
    param("numeroPoliza")
      .isInt({ min: 1 })
      .withMessage("El Num poliza debe ser un número entero positivo"),
  ],
  // HU 18.4 --- El backend debe ser capaz de devolver una lista de los siniestros y revisiones de una póliza en especifico. (fecha, hora y estado de cada siniestro/revision).
  getAllSiniestrosYRevisiones: [
    param("numeroPoliza")
      .isInt({ min: 1 })
      .withMessage("El Num poliza debe ser un número entero positivo"),
  ],
  // 18.4 --- El backend debe ser capaz de devolver un siniestro en especifico (Datos: Todos)
  getSiniestroById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
  // 18.4 --- El backend debe ser capaz de devolver una revision en especifico (Datos: Todos)
  getRevisionById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],
  // 18.4 ---  El backend debe ser capaz de devolver la documentación de la póliza en especifico.
  getDocumentacionByPoliza: [
    param("numeroPoliza")
      .isInt({ min: 1 })
      .withMessage("El Num poliza debe ser un número entero positivo"),
  ],

  // HU 19: El backend debe ser capaz de devolver un siniestro en especifico (Datos del siniestro a traer: Todos los del siniestro y la poliza).
  getAllDataSiniestroById: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),
  ],

  updateStateSiniestro: [
    param("id")
      .isInt({ min: 1 })
      .withMessage("El ID debe ser un número entero positivo"),

    body("estadoSiniestro")
      .notEmpty()
      .withMessage("El estadoSiniestro de la poliza es requerida")
      .isIn(Object.values(EstadoSiniestro))
      .withMessage(
        `El estado del siniestro debe ser uno de: ${Object.values(
          EstadoSiniestro
        ).join(", ")}`
      ),
  ],
};
