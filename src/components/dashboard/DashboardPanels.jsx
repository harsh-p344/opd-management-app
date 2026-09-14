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
  <div className="sticky top-0 z-10 flex min-h-[86px] items-center justify-between gap-4 border-b border-slate-800 bg-[linear-gradient(110deg,#020617,#0f172a_65%,#111827)] px-6 py-4">
    <div className="flex min-w-0 items-center gap-3"><i className={`h-9 w-1 shrink-0 rounded-full ${accent}`} aria-hidden="true" /><div className="min-w-0"><small className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</small><h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-white">{title}</h2></div></div>
    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-300">{badge}</span>
  </div>
);

export const DashboardPanels = () => (
  <section className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
    <article className="dashboard-scroll dashboard-rise min-h-[280px] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[340px] sm:max-h-[46vh]" style={{ animationDelay: '420ms' }}>
      <PanelHeading eyebrow="Patient flow" title="Recent OPD entries" accent="bg-sky-500" badge="Last visits" />
      <div className="divide-y divide-slate-100">{sampleVisits.map((visit) => <div key={visit.id} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-sky-50/60"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">{visit.name.split(' ').map((part) => part[0]).join('')}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium text-slate-800">{visit.name}</p><time className="shrink-0 text-[11px] text-slate-400">{visit.time}</time></div><div className="mt-1 flex items-center gap-2 text-xs text-slate-500"><span>{visit.id}</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span className="truncate">{visit.diagnosis}</span></div></div><span className={`hidden rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${visit.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{visit.status}</span></div>)}</div>
    </article>
    <article className="dashboard-scroll dashboard-rise min-h-[280px] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[340px] sm:max-h-[46vh]" style={{ animationDelay: '500ms' }}>
      <PanelHeading eyebrow="Clinical trends" title="Complaint frequency" accent="bg-emerald-400" badge="Sample data" />
      <div className="space-y-4 bg-slate-50/45 p-5">{sampleComplaints.map((item, index) => <div key={item.label} className="rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-sm transition duration-200 hover:border-sky-200 hover:shadow-md"><div className="flex items-center justify-between text-sm text-slate-600"><span className="font-medium">{item.label}</span><b className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-900">{item.count}</b></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><span className="dashboard-rise block h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style={{ width: `${(item.count / sampleComplaints[0].count) * 100}%`, animationDelay: `${index * 100 + 600}ms` }} /></div></div>)}</div>
    </article>
  </section>
);
