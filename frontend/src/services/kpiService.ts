import type { RndKpiSnapshot } from '../types/dashboard.types'

export async function fetchRndKpis(): Promise<RndKpiSnapshot> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kpis`)

  if (!response.ok) {
    throw new Error(`Failed to fetch KPIs: ${response.status}`)
  }

  return (await response.json()) as RndKpiSnapshot
}
