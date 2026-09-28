import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect, useRef, useState } from 'react'
import { fetchGuestToken } from '../../services/guestTokenService'
import { Button } from '../ui/Button'

type Status = 'loading' | 'ready' | 'error'

export function EmbeddedDashboard() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!mountRef.current) return

    setStatus('loading')
    let unmount: (() => void) | undefined
    let cancelled = false

    embedDashboard({
      id: import.meta.env.VITE_SUPERSET_DASHBOARD_ID,
      supersetDomain: import.meta.env.VITE_SUPERSET_DOMAIN,
      mountPoint: mountRef.current,
      fetchGuestToken,
      dashboardUiConfig: { hideTitle: true },
    })
      .then((dashboard) => {
        if (cancelled) return
        unmount = dashboard.unmount
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      unmount?.()
    }
  }, [retryKey])

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          Carregando dashboard...
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-slate-600">
          <p>
            Unable to load the dashboard. Please check whether the backend and Superset are
            running.
          </p>
          <Button onClick={() => setRetryKey((key) => key + 1)}>Tentar novamente</Button>
        </div>
      )}
      <div
        ref={mountRef}
        className="h-[600px] w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
      />
    </div>
  )
}
