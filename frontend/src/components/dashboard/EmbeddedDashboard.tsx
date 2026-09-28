import type { EmbeddedDashboard as SupersetEmbeddedDashboard } from '@superset-ui/embedded-sdk'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect, useRef, useState } from 'react'
import type { Theme } from '../../hooks/useTheme'
import { fetchGuestToken } from '../../services/guestTokenService'
import { Button } from '../ui/Button'

type Status = 'loading' | 'ready' | 'error'

interface CountryOption {
  label: string
  value?: string
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { label: 'All countries' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'United States', value: 'United States' },
  { label: 'China', value: 'China' },
  { label: 'Germany', value: 'Germany' },
  { label: 'South Korea', value: 'South Korea' },
]

interface EmbeddedDashboardProps {
  theme: Theme
}

export function EmbeddedDashboard({ theme }: EmbeddedDashboardProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const embeddedRef = useRef<SupersetEmbeddedDashboard | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [retryKey, setRetryKey] = useState(0)
  const [country, setCountry] = useState<string | undefined>(undefined)
  const themeRef = useRef(theme)

  useEffect(() => {
    if (!mountRef.current) return

    setStatus('loading')
    embeddedRef.current = null
    let cancelled = false

    embedDashboard({
      id: import.meta.env.VITE_SUPERSET_DASHBOARD_ID,
      supersetDomain: import.meta.env.VITE_SUPERSET_DOMAIN,
      mountPoint: mountRef.current,
      fetchGuestToken: () => fetchGuestToken(country),
      dashboardUiConfig: { hideTitle: true },
    })
      .then((dashboard) => {
        if (cancelled) return
        embeddedRef.current = dashboard
        dashboard.setThemeMode(themeRef.current === 'dark' ? 'dark' : 'default')
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      embeddedRef.current?.unmount()
      embeddedRef.current = null
    }
  }, [retryKey, country])

  useEffect(() => {
    themeRef.current = theme
    embeddedRef.current?.setThemeMode(theme === 'dark' ? 'dark' : 'default')
  }, [theme])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {COUNTRY_OPTIONS.map((option) => (
          <Button
            key={option.label}
            variant={country === option.value ? 'primary' : 'secondary'}
            onClick={() => setCountry(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="relative min-h-[600px] w-full overflow-hidden rounded-md border border-line bg-surface">
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
            Loading dashboard...
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-ink-muted">
            <p>Unable to load the dashboard. Please check if the backend and Superset are running.</p>
            <Button onClick={() => setRetryKey((key) => key + 1)}>Try again</Button>
          </div>
        )}
        <div
          ref={mountRef}
          className="h-[600px] w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
        />
      </div>
    </div>
  )
}
