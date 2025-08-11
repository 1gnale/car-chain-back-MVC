import { Router } from 'express';

const router = Router();

// Rutas básicas para localidades
router.get('/', (req, res) => {
  res.json({ message: 'Endpoints de localidades - Por implementar' });
});

export default router;
