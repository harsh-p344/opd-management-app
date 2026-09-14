const DashboardHeader = ({ active, onOpenMenu }) => {
  const title = active === 'Overview' ? 'Dashboard' : active;

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-800 bg-black px-4 py-3 shadow-sm sm:min-h-20 sm:px-8 sm:py-4 lg:px-12">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-700 text-base leading-none text-slate-300 transition hover:border-sky-400 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/70 sm:h-10 sm:w-10 sm:text-lg" type="button" onClick={onOpenMenu} aria-label="Open navigation">☰</button>
        <div className="min-w-0"><small className="block truncate text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:text-xs sm:tracking-[0.2em]">{active}</small><h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1></div>
      </div>
      <span className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 sm:flex"><i className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />System ready</span>
    </header>
  );
};

export default DashboardHeader;
