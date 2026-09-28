import { EmbeddedDashboard } from './components/dashboard/EmbeddedDashboard'
import { Card } from './components/ui/Card'

function App() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <Card>
        <h1 className="text-xl font-semibold text-slate-900">R&D Global Insights</h1>
        <p className="mt-1 text-sm text-slate-500">
          Interactive dashboard on investment and production in research and development,
          built with Apache Superset and embedded via guest token.
        </p>
      </Card>

      <EmbeddedDashboard />
    </main>
  )
}

export default App
