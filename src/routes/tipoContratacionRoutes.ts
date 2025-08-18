import { Router } from "express";
import { tipoContratacionController } from "../controllers/tipoContratacionController";
import { TipoContratacionValidation } from "../utils/validationsTipoContratacion";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", tipoContratacionController.getAllTipoContratacion);

router.get(
  "/:id",
  TipoContratacionValidation.getById,
  handleValidationErrors,
  tipoContratacionController.getTipoContratacionById
);

router.post(
  "/",
  TipoContratacionValidation.create,
  handleValidationErrors,
  tipoContratacionController.createTipoContratacion
);

router.put(
  "/update/:id",
  TipoContratacionValidation.update,
  handleValidationErrors,
  tipoContratacionController.updateTipoContratacion
);

router.put(
  "/delete/:id",
  TipoContratacionValidation.delete,
  handleValidationErrors,
  tipoContratacionController.deleteTipoContratacion
);

export default router;
