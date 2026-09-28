import { Router } from 'express';
import { isRlsCountry } from '../constants/rlsCountries.js';
import { fetchGuestToken } from '../services/supersetAuth.service.js';

const router = Router();

router.post('/', async (req, res) => {
  const country = req.body?.country;

  if (country !== undefined && !isRlsCountry(country)) {
    res.status(400).json({ error: 'Invalid country filter' });
    return;
  }

  try {
    const token = await fetchGuestToken(country);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: 'Failed to issue guest token' });
  }
});

export default router;
