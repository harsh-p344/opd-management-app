import './App.css'

const stats = [
  { label: 'Total Patients', value: '248' },
  { label: 'Medicines', value: '1,284' },
  { label: 'Expired', value: '09' },
  { label: 'Low Stock', value: '14' },
]

const quickActions = ['New Patient', 'Prescription', 'Stock Entry', 'Expiry Review']

function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Clinic OPD</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Management Dashboard</h1>
          </div>
          <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            Add Patient
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/30">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Live
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <button
                  key={action}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">System Health</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="flex items-center justify-between"><span>API</span><span className="text-emerald-400">Online</span></li>
              <li className="flex items-center justify-between"><span>MongoDB</span><span className="text-emerald-400">Connected</span></li>
              <li className="flex items-center justify-between"><span>Inventory</span><span className="text-yellow-400">Monitor</span></li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
