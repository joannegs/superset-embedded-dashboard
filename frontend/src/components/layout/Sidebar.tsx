import type { Theme } from '../../hooks/useTheme'
import type { View } from '../../types/navigation.types'
import { NAV_ITEMS } from './navItems'
import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  activeView: View
  onNavigate: (view: View) => void
  theme: Theme
  onToggleTheme: () => void
}

export function Sidebar({ activeView, onNavigate, theme, onToggleTheme }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-line bg-sidebar lg:flex">
      <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = view === activeView
          return (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              aria-current={active ? 'page' : undefined}
              className={`flex cursor-pointer items-center gap-3 border-l-2 px-7 py-3 text-sm transition-colors ${
                active
                  ? 'border-accent bg-surface-hover text-accent'
                  : 'border-transparent text-ink-muted hover:bg-surface hover:text-ink'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="mx-7 my-6 border-t border-line" />

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </aside>
  )
}
