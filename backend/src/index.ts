import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import guestTokenRouter from './routes/guestToken.route.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
});

app.use('/api/guest-token', guestTokenRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
});
