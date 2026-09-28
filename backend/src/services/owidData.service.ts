import { Pool } from 'pg'
import type { RndKpiSnapshot } from '../interfaces/owidData.interface.js'

const REFERENCE_YEAR = 2020

let pool: Pool | undefined

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.OWID_DB_NAME,
    })
  }
  return pool
}

interface RndKpiRow {
  rnd_spending_pct_gdp: string | null
  researchers_per_million: string | null
  patent_applications_per_million: string | null
  scientific_publications_per_million: string | null
}

export async function fetchRndKpiSnapshot(): Promise<RndKpiSnapshot> {
  const result = await getPool().query<RndKpiRow>(
    `SELECT
      AVG(rnd_spending_pct_gdp) AS rnd_spending_pct_gdp,
      AVG(researchers_per_million) AS researchers_per_million,
      AVG(patent_applications_per_million) AS patent_applications_per_million,
      AVG(scientific_publications_per_million) AS scientific_publications_per_million
    FROM rnd_indicators
    WHERE year = $1`,
    [REFERENCE_YEAR],
  )

  const row = result.rows[0]

  return {
    year: REFERENCE_YEAR,
    rndSpendingPctGdp: Number(row.rnd_spending_pct_gdp),
    researchersPerMillion: Number(row.researchers_per_million),
    patentApplicationsPerMillion: Number(row.patent_applications_per_million),
    scientificPublicationsPerMillion: Number(row.scientific_publications_per_million),
  }
}
