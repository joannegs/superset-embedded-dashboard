import type { Theme } from '../../hooks/useTheme'
import { MoonIcon, SunIcon } from '../ui/Icons'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  compact?: boolean
}

export function ThemeToggle({ theme, onToggle, compact = false }: ThemeToggleProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const Icon = theme === 'dark' ? SunIcon : MoonIcon
  const label = `${nextTheme === 'light' ? 'Light' : 'Dark'} mode`

  if (compact) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Switch to ${label.toLowerCase()}`}
        className="cursor-pointer rounded-full p-2 text-ink-muted transition-colors hover:bg-surface hover:text-gold"
      >
        <Icon className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${label.toLowerCase()}`}
      className="flex w-full cursor-pointer items-center gap-3 border-l-2 border-transparent px-7 py-3 text-sm text-ink-muted transition-colors hover:bg-surface hover:text-ink"
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </button>
  )
}
