import { useState } from 'react'
import { EmbeddedDashboard } from './components/dashboard/EmbeddedDashboard'
import { AboutView } from './components/home/AboutView'
import { Hero } from './components/home/Hero'
import { IndicatorCards } from './components/home/IndicatorCards'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { useTheme } from './hooks/useTheme'
import type { View } from './types/navigation.types'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={view}
        onNavigate={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <TopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          activeView={view}
          onNavigate={setView}
        /> */}

        {view === 'dashboard' && <Hero />}

        <main className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-8 lg:px-10">
          {view === 'dashboard' ? (
            <>
              <IndicatorCards />
              <EmbeddedDashboard theme={theme} />
            </>
          ) : (
            <AboutView />
          )}
        </main>

        <footer className="flex flex-col gap-1 px-4 pb-6 text-[11px] text-ink-muted sm:flex-row sm:justify-between sm:px-8 lg:px-10">
          <span>Source: Our World in Data</span>
          <span>This dashboard is part of a technical portfolio project.</span>
        </footer>
      </div>
    </div>
  )
}

export default App
