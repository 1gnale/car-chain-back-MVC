import { Router } from "express";
import { MercadoPagoController } from "../controllers/mercadoPagoController";
import { marcaValidation } from "../utils/validationsMarca";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// HU 20.1 - El backend debe ser capaz de realizar el pago de la poliza via mercadopago, registrando la poliza con estado pendiente hasta que este se concrete.
router.post(
  "/crearPrimerPago",
  MercadoPagoController.crearPrimerMercadoPagoPreference
);

// HU20.1 - El backed debe ser capaz de actualizar los datos de la poliza (Estado aprobado, tipo de contratacion,  periodo de pago y fecha de pago) y el pago (estado vigente) cuando el pago haya sido confirmado.
router.get(
  "/sucessPrimerPago/:numero_poliza/:pagoId/:idTipoContratacion/:idPeriodoPago",
  MercadoPagoController.updateFirstPolizaYPagoState
);

// HU20.1 - El backend debe ser capaz de guardar los datos importantes de la poliza en la blockchain una vez el pago haya sido confirmado
router.post("/deployPoliza/:numeroPoliza", MercadoPagoController.deployPoliza);
router.get("/getExistencia/:numeroPoliza", MercadoPagoController.getExistencia);

// HU20.2 - El backend debe ser capaz de realizar el pago de la poliza via mercadopago, registrando la poliza con estado pendiente hasta que este se concrete.
router.post("/crearPago", MercadoPagoController.crearMercadoPagoPreference);

// HU20.2 - El backend debe ser capaz de cambiar los datos de la póliza en la blockchain.
router.post(
  "/cambiarEstadoPolizaBlockChain/:numeroPoliza/:nuevoEstado",
  MercadoPagoController.cambiarEstadoPolizaBlockChain
);

router.get("/getExistencia/:numeroPoliza", MercadoPagoController.getExistencia);

router.get(
  "/getPolizaBlockchainById/:numeroPoliza",
  MercadoPagoController.getPolizaBlockChain
);

// HU20.2 - El backed debe ser capaz de actualizar los datos del pago (estado vigente) cuando el pago haya sido confirmado.
router.get(
  "/sucessPago/:numero_poliza/:pagoId",
  MercadoPagoController.updatePolizaYPagoState
);

export default router;
