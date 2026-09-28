const STACK = [
  { name: 'Apache Superset', role: 'Charts, dashboard and row-level access via guest tokens' },
  { name: 'Node.js + TypeScript', role: 'Backend that authenticates with Superset and issues guest tokens' },
  { name: 'React + TypeScript', role: 'This interface, embedding the dashboard with the Superset SDK' },
  { name: 'PostgreSQL', role: 'Stores the Our World in Data R&D indicators' },
]

export function AboutView() {
  return (
    <section className="max-w-3xl">
      <h2 className="font-serif text-3xl text-ink">About this project</h2>
      <p className="mt-4 leading-relaxed text-ink-muted">
        A technical portfolio piece showing how an Apache Superset dashboard can be embedded in
        a custom application. The browser never sees Superset credentials: the backend requests
        a short-lived guest token and the frontend uses it to render the dashboard.
      </p>
      <ul className="mt-8 divide-y divide-line rounded-md border border-line bg-surface">
        {STACK.map(({ name, role }) => (
          <li key={name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
            <span className="w-48 shrink-0 text-sm font-medium text-gold">{name}</span>
            <span className="text-sm text-ink-muted">{role}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
