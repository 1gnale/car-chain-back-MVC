import { Router } from "express";
import { CoberturaController } from "../controllers/coberturasController";
import { coberturaValidation } from "../utils/validationsCobertura";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", CoberturaController.getAllCoberturas);

router.get(
  "/:id",
  coberturaValidation.getById,
  handleValidationErrors,
  CoberturaController.getCoberturaById
);

router.post(
  "/",
  coberturaValidation.create,
  handleValidationErrors,
  CoberturaController.createCobertura
);

router.put(
  "/update/:id",
  coberturaValidation.update,
  handleValidationErrors,
  CoberturaController.updateCobertura
);

router.put(
  "/delete/:id",
  coberturaValidation.delete,
  handleValidationErrors,
  CoberturaController.deleteCobertura
);

export default router;
