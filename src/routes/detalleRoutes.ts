import { Router } from "express";
import { DetalleController } from "../controllers/detallesController";
import { detalleValidation } from "../utils/validationsDetalle";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", DetalleController.getAllDetalles);

router.get(
  "/:id",
  DetalleController.getDetalleById,
  handleValidationErrors,
  DetalleController.getDetalleById
);

router.post(
  "/",
  detalleValidation.create,
  handleValidationErrors,
  DetalleController.createDetalle
);

router.put(
  "/update/:id",
  detalleValidation.update,
  handleValidationErrors,
  DetalleController.updateDetalle
);

router.put(
  "/delete/:id",
  detalleValidation.delete,
  handleValidationErrors,
  DetalleController.deleteDetalle
);

export default router;
