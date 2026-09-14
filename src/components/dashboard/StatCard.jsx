const tones = {
  cyan: { card: 'border-sky-200/80 border-t-2 border-t-sky-400 bg-gradient-to-br from-sky-50 to-white', icon: 'bg-sky-100 text-sky-700', rail: 'bg-sky-400' },
  slate: { card: 'border-slate-200/90 border-t-2 border-t-slate-400 bg-gradient-to-br from-slate-100 to-white', icon: 'bg-slate-200 text-slate-700', rail: 'bg-slate-400' },
  red: { card: 'border-rose-200/80 border-t-2 border-t-rose-400 bg-gradient-to-br from-rose-50 to-white', icon: 'bg-rose-100 text-rose-700', rail: 'bg-rose-400' },
  amber: { card: 'border-amber-200/80 border-t-2 border-t-amber-400 bg-gradient-to-br from-amber-50 to-white', icon: 'bg-amber-100 text-amber-700', rail: 'bg-amber-400' },
};

const StatCard = ({ label, value, note, tone, delay = 0 }) => {
  const style = tones[tone];

  return (
    <article className={`dashboard-rise group relative flex min-h-[178px] flex-col overflow-hidden rounded-2xl border p-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.13)] ${style.card}`} style={{ animationDelay: `${delay * 90}ms` }}>
    <span className="dashboard-pulse absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-current opacity-40 transition group-hover:scale-150" aria-hidden="true" />
    <span className="dashboard-sweep pointer-events-none absolute -left-1/2 top-0 h-px w-1/3 bg-white/80" aria-hidden="true" />
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-bold shadow-inner ${style.icon}`} aria-hidden="true">{label.slice(0, 1)}</span>
        <div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p><span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-slate-400">Live metric</span></div>
      </div>
    </div>
    <div className="mt-auto pt-5"><strong className="block text-4xl font-semibold tracking-tight text-slate-900 transition duration-300 group-hover:translate-x-1">{value}</strong></div>
    <div className="mt-4 flex items-center gap-3 border-t border-slate-200/80 pt-3"><span className={`h-1.5 w-10 rounded-full ${style.rail}`} /><span className="text-xs leading-5 text-slate-500">{note}</span></div>
    </article>
  );
};

export default StatCard;
