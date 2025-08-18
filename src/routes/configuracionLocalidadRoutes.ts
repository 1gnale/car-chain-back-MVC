import { Router } from "express";
import { ConfiguracionLocalidadController } from "../controllers/configuracionLocalidadController";
import { configLocalidadValidation } from "../utils/validationsConfiguracionLocalidad";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", ConfiguracionLocalidadController.getAllConfiguracionLocalidad);

router.get(
  "/byId/:id",
  configLocalidadValidation.getById,
  handleValidationErrors,
  ConfiguracionLocalidadController.getConfiguracionLocalidadById
);

router.get(
  "/byLocality/:localityId",
  configLocalidadValidation.getByLocality,
  handleValidationErrors,
  ConfiguracionLocalidadController.getConfiguracionLocalidadByLocality
);

router.post(
  "/",
  configLocalidadValidation.create,
  handleValidationErrors,
  ConfiguracionLocalidadController.createConfiguracionLocalidad
);

router.put(
  "/update/:id",
  configLocalidadValidation.update,
  handleValidationErrors,
  ConfiguracionLocalidadController.updateConfiguracionLocalidad
);

router.put(
  "/delete/:id",
  configLocalidadValidation.delete,
  handleValidationErrors,
  ConfiguracionLocalidadController.deleteConfiguracionLocalidad
);

export default router;
