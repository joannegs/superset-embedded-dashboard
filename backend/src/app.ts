import cors from 'cors';
import express from 'express';
import guestTokenRouter from './routes/guestToken.route.js';

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/guest-token', guestTokenRouter);

export default app;
