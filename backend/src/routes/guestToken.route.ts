import { Router } from 'express';
import { fetchGuestToken } from '../services/supersetAuth.service.js';

const router = Router();

router.post('/', async (_req, res) => {
  try {
    const token = await fetchGuestToken();
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: 'Failed to issue guest token' });
  }
});

export default router;
