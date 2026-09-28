import { Router } from 'express'
import { fetchRndKpiSnapshot } from '../services/owidData.service.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const snapshot = await fetchRndKpiSnapshot()
    res.json(snapshot)
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'Failed to fetch KPI data' })
  }
})

export default router
