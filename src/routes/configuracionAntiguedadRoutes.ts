import { Router } from "express";
import { ConfiguracionAntiguedadController } from "../controllers/configuracionAntiguedadController";
import { configAntiguedadValidation } from "../utils/validationsConfiguracionAntiguedad";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get(
  "/",
  ConfiguracionAntiguedadController.getAllConfiguracionAntiguedad
);

router.get(
  "/byId/:id",
  configAntiguedadValidation.getById,
  handleValidationErrors,
  ConfiguracionAntiguedadController.getConfiguracionAntiguedadById
);

router.get(
  "/byAge/:age",
  configAntiguedadValidation.getByAge,
  handleValidationErrors,
  ConfiguracionAntiguedadController.getConfiguracionAntiguedadByAge
);

router.post(
  "/",
  configAntiguedadValidation.create,
  handleValidationErrors,
  ConfiguracionAntiguedadController.createConfiguracionAntiguedad
);

router.put(
  "/update/:id",
  configAntiguedadValidation.update,
  handleValidationErrors,
  ConfiguracionAntiguedadController.updateConfiguracionAntiguedad
);

router.put(
  "/delete/:id",
  configAntiguedadValidation.delete,
  handleValidationErrors,
  ConfiguracionAntiguedadController.deleteConfiguracionAntiguedad
);

export default router;
