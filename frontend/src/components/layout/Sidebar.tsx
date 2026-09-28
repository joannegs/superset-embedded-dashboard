import type { Theme } from '../../hooks/useTheme'
import type { View } from '../../types/navigation.types'
import { Brand } from './Brand'
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
      <div className="flex h-20 items-center px-7">
        <Brand />
      </div>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
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
                  ? 'border-gold bg-surface-hover text-gold'
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

      <svg
        className="pointer-events-none absolute -left-24 bottom-10 h-96 w-80 text-gold/40"
        viewBox="0 0 320 384"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
      >
        <circle cx="120" cy="190" r="130" />
        <circle cx="80" cy="260" r="150" />
        <ellipse cx="150" cy="230" rx="170" ry="110" />
      </svg>

      <p className="relative mt-auto px-7 pb-10 text-xs leading-relaxed text-gold/80">
        Better decisions
        <br />
        through data.
      </p>
    </aside>
  )
}
