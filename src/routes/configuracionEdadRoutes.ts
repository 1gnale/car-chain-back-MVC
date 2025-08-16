import { Router } from "express";
import { ConfiguracionEdadController } from "../controllers/configuracionEdadController";
import { configEdadValidation } from "../utils/validationsConfiguracionEdad";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", ConfiguracionEdadController.getAllConfiguracionEdad);

router.get(
  "/byId/:id",
  configEdadValidation.getById,
  handleValidationErrors,
  ConfiguracionEdadController.getConfiguracionEdadById
);

router.get(
  "/byAge/:age",
  configEdadValidation.getByAge,
  handleValidationErrors,
  ConfiguracionEdadController.getConfiguracionEdadByAge
);

router.post(
  "/",
  configEdadValidation.create,
  handleValidationErrors,
  ConfiguracionEdadController.createConfiguracionEdad
);

router.put(
  "/update/:id",
  configEdadValidation.update,
  handleValidationErrors,
  ConfiguracionEdadController.updateConfiguracionEdad
);

router.put(
  "/delete/:id",
  configEdadValidation.delete,
  handleValidationErrors,
  ConfiguracionEdadController.deleteConfiguracionEdad
);

export default router;
