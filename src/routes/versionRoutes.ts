import { Router } from 'express';
import { handleValidationErrors } from "../middleware/validation";
import { VersionesController } from '../controllers/versionesController';
import { versionValidation } from '../utils/validationsVersiones';

const router = Router();
router.get("/", VersionesController.getAllVersiones);
router.post(
  "/",
  versionValidation.create,
  handleValidationErrors,
  VersionesController.crearVersion
);

router.get(
  "/:id",
  versionValidation.getById,
  handleValidationErrors,
  VersionesController.getVersionById
);

router.put(
  "/update/:id",
  versionValidation.update,
  handleValidationErrors,
  VersionesController.updateVersion
);

router.put("/delete/:id", 
versionValidation.delete,
handleValidationErrors,
VersionesController.deleteVersion);

export default router;