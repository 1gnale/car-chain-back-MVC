import { Router } from "express";
import { CoberturaDetalleController } from "../controllers/coberturaDetalleController";
import { coberturaDetalleValidation } from "../utils/validationsCoberturaDetalle";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", CoberturaDetalleController.getAllCoberturasDetalle);

router.post(
  "/",
  coberturaDetalleValidation.create,
  handleValidationErrors,
  CoberturaDetalleController.createCoberturasDetalle
);

router.put(
  "/update/:id",
  coberturaDetalleValidation.update,
  handleValidationErrors,
  CoberturaDetalleController.updateCoberturaDetalle
);

export default router;
