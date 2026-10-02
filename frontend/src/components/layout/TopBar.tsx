import type { Theme } from '../../hooks/useTheme'
import type { View } from '../../types/navigation.types'
import { NAV_ITEMS } from './navItems'
import { ThemeToggle } from './ThemeToggle'

interface TopBarProps {
  theme: Theme
  onToggleTheme: () => void
  activeView: View
  onNavigate: (view: View) => void
}

export function TopBar({ theme, onToggleTheme, activeView, onNavigate }: TopBarProps) {
  return (
    <header className="border-b border-line bg-sidebar lg:hidden">
      <div className="flex h-16 items-center justify-end gap-4 px-4 sm:px-8">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
      </div>

      <nav className="flex gap-1 px-4 pb-3 sm:px-8" aria-label="Main">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            type="button"
            onClick={() => onNavigate(view)}
            aria-current={view === activeView ? 'page' : undefined}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
              view === activeView ? 'bg-surface-hover text-accent' : 'text-ink-muted'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
