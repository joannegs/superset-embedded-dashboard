import { LogoMark } from '../ui/Icons'

export function Brand() {
  return (
    <div className="flex items-center gap-4">
      <LogoMark className="h-11 w-11 text-gold" />
      <div className="leading-none">
        <p className="font-serif text-lg tracking-[0.35em] text-ink">ALCHEMY</p>
        <p className="mt-1.5 text-[9px] tracking-[0.4em] text-ink-muted">DATA INSIGHTS</p>
      </div>
    </div>
  )
}
