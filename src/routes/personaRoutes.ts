import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Endpoints de personas - Por implementar' });
});

export default router;
