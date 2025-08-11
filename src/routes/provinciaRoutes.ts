import { Router } from 'express';
import { ProvinciaController } from '../controllers/provinciaController';
import { provinciaValidation } from '../utils/validations';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Rutas para provincias
router.get('/', ProvinciaController.getAllProvincias);
router.get('/:id', 
  provinciaValidation.getById, 
  handleValidationErrors, 
  ProvinciaController.getProvinciaById
);
router.post('/', 
  provinciaValidation.create, 
  handleValidationErrors, 
  ProvinciaController.createProvincia
);
router.put('/:id', 
  provinciaValidation.update, 
  handleValidationErrors, 
  ProvinciaController.updateProvincia
);
router.delete('/:id', 
  provinciaValidation.delete, 
  handleValidationErrors, 
  ProvinciaController.deleteProvincia
);

export default router;
