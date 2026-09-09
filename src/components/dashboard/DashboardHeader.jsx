const DashboardHeader = ({ active, onOpenMenu }) => (
  <header className="flex min-h-16 items-center justify-between border-b border-slate-800 bg-black px-5 py-3 shadow-sm sm:px-8 lg:px-12">
    <div className="flex items-center gap-4">
      <button className="border border-slate-700 px-3 py-2 text-lg leading-none text-slate-300 transition hover:border-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/70" type="button" onClick={onOpenMenu} aria-label="Open navigation">☰</button>
      <div><small className="block text-xs uppercase tracking-[0.2em] text-slate-400">{active}</small><h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Dashboard</h1></div>
    </div>
    <span className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><i className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />System ready</span>
  </header>
);

export default DashboardHeader;
