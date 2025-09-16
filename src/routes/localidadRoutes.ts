import { Router } from 'express';
import { LocalidadesController } from '../controllers/localidadesController';
import { localidadesValidation } from '../utils/validationsLocalidades';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// Obtener todas las localidades con filtros
router.get('/', 
  localidadesValidation.getAll, 
  handleValidationErrors, 
  LocalidadesController.getAllLocalidades
);

// Crear nueva localidad
router.post('/create', 
  localidadesValidation.create, 
  handleValidationErrors, 
  LocalidadesController.createLocalidad
);

// Obtener localidad por ID
router.get('/id/:id', 
  localidadesValidation.getById, 
  handleValidationErrors, 
  LocalidadesController.getLocalidadById
);

// Obtener localidades por provincia
router.get('/provincia/:provinciaId', 
  localidadesValidation.getByProvincia, 
  handleValidationErrors, 
  LocalidadesController.getLocalidadesByProvincia
);

// Buscar por código postal
router.get('/codigo-postal/:codigoPostal', 
  localidadesValidation.getByCodigoPostal, 
  handleValidationErrors, 
  LocalidadesController.getLocalidadByCodigoPostal
);

// Actualizar localidad completa
router.put('/update/:id', 
  localidadesValidation.update, 
  handleValidationErrors, 
  LocalidadesController.updateLocalidad
);

// Cambiar estado activo/inactivo
router.patch('/estado/:id', 
  localidadesValidation.updateEstado, 
  handleValidationErrors, 
  LocalidadesController.updateLocalidadEstado
);

export default router;
