const tones = {
  cyan: 'border-sky-200/80 border-t-2 border-t-sky-400 bg-sky-50/80',
  slate: 'border-slate-200/90 border-t-2 border-t-slate-400 bg-slate-50',
  red: 'border-rose-200/80 border-t-2 border-t-rose-400 bg-rose-50/70',
  amber: 'border-amber-200/80 border-t-2 border-t-amber-400 bg-amber-50/70',
};

const StatCard = ({ label, value, note, tone }) => (
  <article className={`group relative flex min-h-[168px] flex-col overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] ${tones[tone]}`}>
    <span className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-current opacity-40 transition group-hover:scale-150" aria-hidden="true" />
    <div className="flex items-center gap-2">
      <span className="h-4 w-1 rounded-full bg-current opacity-50" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-700">{label}</p>
    </div>
    <strong className="mt-auto block pt-6 text-4xl font-semibold tracking-tight text-slate-900">{value}</strong>
    <span className="mt-2 block text-xs leading-5 text-slate-500">{note}</span>
  </article>
);

export default StatCard;
