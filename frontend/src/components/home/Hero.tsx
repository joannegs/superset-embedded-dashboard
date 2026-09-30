export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-hero">
      <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/70 to-transparent md:via-transparent" />
      <div className="relative max-w-2xl px-4 py-10 md:max-w-[55%] sm:px-8 sm:py-12 lg:px-11">
        <p className="text-[11px] tracking-[0.3em] text-ink-muted">
          OUR WORLD IN DATA DASHBOARD
        </p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
         This dashboard explores how countries invest in research and development, from spending and
        researchers to patents and scientific output, based on Our World in Data set.
        </p>
      </div>
    </section>
  )
}
