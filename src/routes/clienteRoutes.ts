import { Router } from 'express';
import { ClientesController } from '../controllers/clientesController';
const router = Router();
router.get('/', ClientesController.getAllClientes);
router.post('/create-cliente', ClientesController.createCliente);
router.get('/get-cliente-by-email/:email', ClientesController.getClienteByEmail);
router.put('/update-cliente/:email', ClientesController.updateCliente);

//puto el que lee
export default router;
