import { Router } from 'express';
import { ClientesController } from '../controllers/clientesController';
import { clientesValidation } from '../utils/validationsClientes';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

router.get('/', 
  clientesValidation.getAll, 
  handleValidationErrors, 
  ClientesController.getAllClientes
);

router.post('/create-cliente', 
  clientesValidation.create, 
  handleValidationErrors, 
  ClientesController.createCliente
);

router.get('/get-cliente-by-email/:email', 
  clientesValidation.getByEmail, 
  handleValidationErrors, 
  ClientesController.getClienteByEmail
);

router.put('/update-cliente/:email', 
  clientesValidation.update, 
  handleValidationErrors, 
  ClientesController.updateCliente
);

export default router;
