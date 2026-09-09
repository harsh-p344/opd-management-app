const sampleVisits = [];
const sampleComplaints = [
  { label: 'Fever', count: 32 },
  { label: 'Cough', count: 24 },
  { label: 'Follow-up', count: 18 },
  { label: 'Body pain', count: 12 },
];

const PanelHeading = ({ eyebrow, title, accent, badge }) => (
  <div className="flex min-h-[82px] items-center justify-between gap-4 border-b border-slate-800 bg-black px-6 py-4">
    <div className="flex min-w-0 items-center gap-3"><i className={`h-2.5 w-2.5 shrink-0 rounded-sm ${accent}`} aria-hidden="true" /><div className="min-w-0"><small className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">{eyebrow}</small><h2 className="mt-1 truncate text-base font-semibold text-white">{title}</h2></div></div>
    <span className="shrink-0 text-xs text-slate-400">{badge}</span>
  </div>
);

export const DashboardPanels = () => (
  <section className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
    <article className="min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <PanelHeading eyebrow="Patient flow" title="Recent OPD entries" accent="bg-sky-500" badge="Last visits" />
      {sampleVisits.length === 0 ? <p className="px-6 py-9 text-sm leading-6 text-slate-500">No OPD entries have been recorded yet.</p> : null}
    </article>
    <article className="min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <PanelHeading eyebrow="Clinical trends" title="Complaint frequency" accent="bg-emerald-400" badge="Sample data" />
      <div className="space-y-5 p-6">{sampleComplaints.map((item) => <div key={item.label}><div className="flex justify-between text-sm text-slate-600"><span>{item.label}</span><b className="text-slate-900">{item.count}</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-sky-600" style={{ width: `${(item.count / sampleComplaints[0].count) * 100}%` }} /></div></div>)}</div>
    </article>
  </section>
);
