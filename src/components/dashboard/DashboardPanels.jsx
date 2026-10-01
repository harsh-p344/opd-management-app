const sampleVisits = [
  { name: 'Aarav Sharma', id: 'OPD-1048', diagnosis: 'Viral fever', time: '09:42 AM', status: 'Completed' },
  { name: 'Maya Patel', id: 'OPD-1047', diagnosis: 'Respiratory infection', time: '09:18 AM', status: 'In review' },
  { name: 'Rohan Mehta', id: 'OPD-1046', diagnosis: 'Tension headache', time: '08:56 AM', status: 'Completed' },
  { name: 'Sara Khan', id: 'OPD-1045', diagnosis: 'Gastritis', time: '08:31 AM', status: 'Completed' },
  { name: 'Ishaan Verma', id: 'OPD-1044', diagnosis: 'Common cold', time: '08:05 AM', status: 'Completed' },
];
const sampleComplaints = [
  { label: 'Fever', count: 32 },
  { label: 'Cough', count: 24 },
  { label: 'Follow-up', count: 18 },
  { label: 'Body pain', count: 12 },
];

const PanelHeading = ({ eyebrow, title, accent, badge }) => (
  <div className="sticky top-0 z-10 flex min-h-[78px] items-center justify-between gap-4 border-b border-slate-700/80 bg-[linear-gradient(135deg,#0b1120,#111827_50%,#0f172a)] px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
    <div className="flex items-center gap-3"><span className={`h-9 w-1 rounded-full ${accent}`} /><div><small className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">{eyebrow}</small><h2 className="mt-1 text-base font-semibold tracking-tight text-slate-100">{title}</h2></div></div>
    <span className="rounded-full border border-slate-600/80 bg-slate-800/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-200 shadow-inner shadow-slate-900/50">{badge}</span>
  </div>
);

export const DashboardPanels = () => (
  <section className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1.12fr_0.88fr]">
    <article className="dashboard-scroll dashboard-rise overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:h-[340px] sm:max-h-[46vh]" style={{ animationDelay: '420ms' }}>
      <PanelHeading eyebrow="Patient flow" title="" accent="bg-sky-500" badge="Live" />
      <div className="divide-y divide-slate-100 bg-white">{sampleVisits.map((visit) => <div key={visit.id} className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-sky-50/60"><div className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">{visit.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium text-slate-800">{visit.name}</p><time className="shrink-0 text-[11px] text-slate-400">{visit.time}</time></div><div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><span>{visit.id}</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span className="truncate">{visit.diagnosis}</span></div></div><span className={`hidden rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${visit.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{visit.status}</span></div>)}</div>
    </article>
    <article className="dashboard-scroll dashboard-rise overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:h-[340px] sm:max-h-[46vh]" style={{ animationDelay: '500ms' }}>
      <PanelHeading eyebrow="Clinical trends" title="" accent="bg-emerald-400" badge="Insights" />
      <div className="space-y-4 bg-slate-50 p-5">{sampleComplaints.map((item, index) => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold tracking-tight text-slate-700">{item.label}</span><span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{item.count}</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><span className="dashboard-rise block h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style={{ width: `${(item.count / sampleComplaints[0].count) * 100}%`, animationDelay: `${index * 100 + 600}ms` }} /></div></div>)}</div>
    </article>
  </section>
);
