import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// TODO (Fase 2): montar a rota de guest token (ver src/routes/guestToken.route.ts)

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
