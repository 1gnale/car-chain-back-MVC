import { Router } from "express";
import { PolizaController } from "../controllers/polizaController";
import { PolizaValidation } from "../utils/validationsPoliza";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Historia de usuario 9.2 --- El backend debe ser capaz de guardar los datos de la documentacion.
router.post("/createDocumentacion", PolizaController.createDocumentacion);

// HU 9.2 --- El backend debe ser capaz de obtener la documentación de la póliza.
router.get(
  "/getDocumentacion/:id",
  PolizaValidation.getDocumentacionById,
  handleValidationErrors,
  PolizaController.getDocumentacionById
);

// HU 9.2  --- El backend debe ser capaz de guardar la póliza con estado "Pendiente"
router.post(
  "/createPoliza",
  PolizaValidation.createPoliza,
  handleValidationErrors,
  PolizaController.createPoliza
);

// HU 11/12 --- El backend debe ser capaz de devolver una lista con todas las polizas (Datos de poliza a traer: N° poliza, cobertura, titular, vehiculo, fecha de creacion y estado).
router.get("/getAllPolizas", PolizaController.getAllPolizas);

/// HU 11/12/18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una poliza en especifico (Datos de la poliza a traer: Todos).
router.get(
  "/getPolizaById/:id",
  PolizaValidation.getPolizaById,
  handleValidationErrors,
  PolizaController.getPolizaById
);

// HU 11/12 --- El backend debe ser capaz de cambiar el estadoPoliza a aprobado, rechazado o en revision (La enumeracion).
router.put(
  "/updateState/:id",
  PolizaValidation.updatePolizaState,
  handleValidationErrors,
  PolizaController.updateStatePoliza
);

// HU 11 --- El backend debe asignar al empleado que cambio el estado de la poliza a la poliza
router.put(
  "/updateUsuarioPoliza/:id",
  PolizaValidation.updateUsuarioPoliza,
  handleValidationErrors,
  PolizaController.updateUsuarioPoliza
);

// HU 12 --- El backend debe ser capaz guardar una revision.
router.post(
  "/createRevision",
  PolizaValidation.createRevision,
  handleValidationErrors,
  PolizaController.createRevision
);
// HU 18.1/18.2/18.3/18.4 --- El backend debe ser capaz de devolver una lista de todas las polizas del cliente (Datos de poliza a traer: N° Poliza, cobertura, fecha de contratacion, hora de contracion, estado).
router.get(
  "/getAllPolizasByClientId/:idClient",
  PolizaValidation.getAllPolizasByClientID,
  handleValidationErrors,
  PolizaController.getAllPolizasByClientID
);

// HU 18.1 --- El backend debe ser capaz de guardar los datos el siniestro con estado "Pendiente"
router.post(
  "/createSiniestro",
  PolizaValidation.createSiniestro,
  handleValidationErrors,
  PolizaController.createSiniestro
);

// HU 18.3 --- El backend debe ser capaz de devolver una lista de pagos de una póliza especifica (Datos de pagos: Todos).
router.get(
  "/getAllPagosPoliza/:numeroPoliza",
  PolizaValidation.getAllPagosPoliza,
  handleValidationErrors,
  PolizaController.getAllPagosPoliza
);

// HU 18.4 --- El backend debe ser capaz de devolver una lista de los siniestros y revisiones de una póliza en especifico. (fecha, hora y estado de cada siniestro/revision).
router.get(
  "/getAllSiniestrosYRevisiones/:numeroPoliza",
  PolizaValidation.getAllSiniestrosYRevisiones,
  handleValidationErrors,
  PolizaController.getAllSiniestrosYRevisiones
);

// 18.4 --- El backend debe ser capaz de devolver un siniestro en especifico (Datos: Todos)
router.get(
  "/getSiniestroById/:id",
  PolizaValidation.getSiniestroById,
  handleValidationErrors,
  PolizaController.getSiniestroById
);

// 18.4 --- El backend debe ser capaz de devolver una revision en especifico (Datos: Todos)
router.get(
  "/getRevisionById/:id",
  PolizaValidation.getRevisionById,
  handleValidationErrors,
  PolizaController.getRevisionById
);

// 18.4 ---  El backend debe ser capaz de devolver la documentación de la póliza en especifico.
router.get(
  "/getDocumentacionByPoliza/:numeroPoliza",
  PolizaValidation.getDocumentacionByPoliza,
  handleValidationErrors,
  PolizaController.getDocumentacionByPoliza
);

// HU 19 --- El backend debe ser capaz de devolver una lista con todas los siniestros (Datos del siniestro a traer: N° poliza, cobertura, titular, vehiculo, fecha, hora y estado).
router.get("/getAllSiniestros", PolizaController.getAllSiniestros);

// HU 19: El backend debe ser capaz de devolver un siniestro en especifico (Datos del siniestro a traer: Todos los del siniestro y la poliza).
router.get(
  "/getAllDataSiniestroById/:id",
  PolizaValidation.getAllDataSiniestroById,
  handleValidationErrors,
  PolizaController.getAllDataSiniestroById
);

// HU 19 --- El backend debe ser capaz de cambiar el estado a aprobado o rechazado (La enumeración).
router.put(
  "/updateStateSiniestro/:id",
  PolizaValidation.updateStateSiniestro,
  handleValidationErrors,
  PolizaController.updateStateSiniestro
);

export default router;
