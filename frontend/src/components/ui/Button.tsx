import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonAsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  href?: undefined
}

interface ButtonAsLink extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  href: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-gold text-canvas hover:bg-gold/90 focus-visible:outline-gold',
  secondary:
    'bg-surface text-ink border border-line hover:bg-surface-hover focus-visible:outline-gold',
  ghost: 'bg-transparent text-ink-muted hover:bg-surface focus-visible:outline-gold',
}

const BASE_CLASSES =
  'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`

  if (props.href !== undefined) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
