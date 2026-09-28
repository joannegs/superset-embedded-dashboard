import type { ComponentType, SVGProps } from 'react'
import { useEffect, useState } from 'react'
import { fetchRndKpis } from '../../services/kpiService'
import type { RndKpiSnapshot } from '../../types/dashboard.types'
import { BookIcon, BulbIcon, CoinsIcon, PeopleIcon } from '../ui/Icons'

interface Indicator {
  label: string
  unit: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  formatValue: (snapshot: RndKpiSnapshot) => string
}

const INDICATORS: Indicator[] = [
  {
    label: 'R&D Spending',
    unit: '% of GDP',
    description: 'Gross domestic expenditure on research',
    icon: CoinsIcon,
    formatValue: (snapshot) => `${snapshot.rndSpendingPctGdp.toFixed(1)}%`,
  },
  {
    label: 'Researchers',
    unit: 'per million',
    description: 'People working in R&D',
    icon: PeopleIcon,
    formatValue: (snapshot) => Math.round(snapshot.researchersPerMillion).toLocaleString('en-US'),
  },
  {
    label: 'Patent Applications',
    unit: 'per million',
    description: 'Filed by residents',
    icon: BulbIcon,
    formatValue: (snapshot) =>
      Math.round(snapshot.patentApplicationsPerMillion).toLocaleString('en-US'),
  },
  {
    label: 'Publications',
    unit: 'per million',
    description: 'Articles in indexed journals',
    icon: BookIcon,
    formatValue: (snapshot) =>
      Math.round(snapshot.scientificPublicationsPerMillion).toLocaleString('en-US'),
  },
]

type Status = 'loading' | 'ready' | 'error'

export function IndicatorCards() {
  const [status, setStatus] = useState<Status>('loading')
  const [snapshot, setSnapshot] = useState<RndKpiSnapshot | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchRndKpis()
      .then((data) => {
        if (cancelled) return
        setSnapshot(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {INDICATORS.map(({ label, unit, description, icon: Icon, formatValue }) => (
        <li key={label} className="rounded-md border border-line bg-surface p-5">
          <div className="flex items-center gap-4">
            <Icon className="h-7 w-7 text-gold" />
            <span className="text-sm text-ink">{label}</span>
          </div>
          <p className="mt-4 font-serif text-3xl text-ink">
            {status === 'ready' && snapshot ? formatValue(snapshot) : status === 'error' ? '—' : '···'}
            <span className="ml-2 text-base text-ink-muted">{unit}</span>
          </p>
          <p className="mt-2 text-xs text-ink-muted">{description}</p>
        </li>
      ))}
    </ul>
  )
}
