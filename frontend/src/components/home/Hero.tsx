import headerDark from '../../images/header.png'
import headerLight from '../../images/header-light.png'

const IMAGE_CLASSES =
  'pointer-events-none absolute inset-0 h-full w-full object-cover object-right'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-hero">
      <img src={headerDark} alt="" className={`${IMAGE_CLASSES} hidden dark:block`} />
      <img src={headerLight} alt="" className={`${IMAGE_CLASSES} dark:hidden`} />
      <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/70 to-transparent md:via-transparent" />
      <div className="relative max-w-2xl px-4 py-10 md:max-w-[55%] sm:px-8 sm:py-12 lg:px-11">
        <p className="text-[11px] tracking-[0.3em] text-ink-muted">
          WELCOME TO YOUR DATA DASHBOARD
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight font-medium text-ink sm:text-5xl">
          Global R&amp;D Indicators
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Explore how countries invest in research and development, from spending and
          researchers to patents and scientific output, based on Our World in Data.
        </p>
      </div>
    </section>
  )
}
