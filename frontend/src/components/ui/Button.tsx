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
  primary: 'bg-brand text-white hover:bg-brand/90 focus-visible:outline-brand',
  secondary:
    'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus-visible:outline-brand',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-brand',
}

const BASE_CLASSES =
  'inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`

  if (props.href !== undefined) {
    return <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
