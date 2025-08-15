import { Router } from "express";
import { ModeloController } from "../controllers/modelosController";
import { modeloValidation } from "../utils/validationsmodelos";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

router.get("/", ModeloController.getModelo);
router.post(
  "/",
  modeloValidation.create,
  handleValidationErrors,
  ModeloController.crearModelo
);

router.get(
  "/:id",
  modeloValidation.getById,
  handleValidationErrors,
  ModeloController.getModeloById
);

router.put(
  "/update/:id",
  modeloValidation.update,
  handleValidationErrors,
  ModeloController.updateModelo
);

router.put("/delete/:id", 
modeloValidation.delete,
handleValidationErrors,
ModeloController.deleteModelo);

export default router;
