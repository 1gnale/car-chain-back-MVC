import { Router } from "express";
import { MarcaController } from "../controllers/marcaController";
import { marcaValidation } from "../utils/validationsMarca";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

// Rutas para marca
router.get("/", MarcaController.getAllMarcas);

router.get(
  "/:id",
  MarcaController.getMarcaById,
  handleValidationErrors,
  MarcaController.getMarcaById
);

router.post(
  "/",
  marcaValidation.create,
  handleValidationErrors,
  MarcaController.createMarca
);

router.put(
  "/update/:id",
  marcaValidation.update,
  handleValidationErrors,
  MarcaController.updateMarca
);

router.put(
  "/delete/:id",
  marcaValidation.delete,
  handleValidationErrors,
  MarcaController.deleteMarca
);

export default router;
