import { Router } from "express";
import { PeriodoPagoController } from "../controllers/periodoPagoController";
import { PeriodoPagoValidation } from "../utils/validationsPeriodoPago";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", PeriodoPagoController.getAllPeriodoPago);

router.get(
  "/:id",
  PeriodoPagoValidation.getById,
  handleValidationErrors,
  PeriodoPagoController.getPeriodoPagoById
);

router.post(
  "/",
  PeriodoPagoValidation.create,
  handleValidationErrors,
  PeriodoPagoController.createPeriodoPago
);

router.put(
  "/update/:id",
  PeriodoPagoValidation.update,
  handleValidationErrors,
  PeriodoPagoController.updatePeriodoPago
);

router.put(
  "/delete/:id",
  PeriodoPagoValidation.delete,
  handleValidationErrors,
  PeriodoPagoController.deletePeriodoPago
);

export default router;
