import { Router } from "express";
import { vehiculoCotizacionController } from "../controllers/vehiculoCotizacionController";
import { VehiculoCotizacionValidation } from "../utils/validationsVehiculoCotizacion";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

router.get(
  //HU9.1  --- El backend debe verificar que no haya una poliza  con la matricula del vehiculo ingresado.
  "/verifyVehicle/:matricula",
  VehiculoCotizacionValidation.verifyMatricula,
  handleValidationErrors,
  vehiculoCotizacionController.verifyVehicle
);

// HU9.1 --- El backend debe ser capaz de guardar los datos del vehiculo
router.post(
  "/createVehicle",
  VehiculoCotizacionValidation.createVehicle,
  handleValidationErrors,
  vehiculoCotizacionController.createVehicle
);

//HU9.1 --- El backend debe ser capaz de guardar los datos de la cotizacion.
router.post(
  "/createCotizacion",
  VehiculoCotizacionValidation.createCotizacion,
  handleValidationErrors,
  vehiculoCotizacionController.createCotizacion
);

// HU9.1 --- El backend debe ser capaz de guardar los datos de la lineaCotizacion.
router.post(
  "/createLineaCotizacion",
  VehiculoCotizacionValidation.createLineaCotizacion,
  handleValidationErrors,
  vehiculoCotizacionController.createLineaCotizacion
);

// HU10 --- El backend debe ser capaz de devolver una lista de todas las cotizaciones del cliente.
router.get(
  "/getCotizacion/:mail",
  VehiculoCotizacionValidation.getCotizacionesByClientId,
  handleValidationErrors,
  vehiculoCotizacionController.getCotizacionesByClientId
);

// HU10 ---  El backend debe ser capaz de devolver una lista de lineaCotizacion de una cotización en especifico.
router.get(
  "/getLineasCotizacion/:cotizacion_id",
  VehiculoCotizacionValidation.getLineasCotizacionByCotizacionId,
  handleValidationErrors,
  vehiculoCotizacionController.getLineasCotizacionByCotizacionId
);

export default router;
