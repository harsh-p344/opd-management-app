const navItems = ['Overview', 'Patients', 'Medicines', 'Stock bills', 'Expiry'];

const Sidebar = ({ active, open, onSelect, onClose }) => (
  <>
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-black px-5 py-7 shadow-sm transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Primary navigation">
      <div>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700"><i className="h-2 w-2 rounded-sm bg-sky-600" aria-hidden="true" />Clinic OPD</span>
        <strong className="mt-2 block text-lg font-semibold text-white">Care operations</strong>
      </div>
      <nav className="mt-12 grid gap-1">
        {navItems.map((item) => (
          <button key={item} className={`rounded-r-lg border-l-2 px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:ring-inset ${active === item ? 'border-sky-400 bg-sky-400/15 text-sky-300 shadow-sm' : 'border-transparent text-slate-400 hover:border-slate-600 hover:bg-slate-900 hover:text-white'}`} onClick={() => onSelect(item)} type="button" aria-current={active === item ? 'page' : undefined}>{item}</button>
        ))}
      </nav>
      <small className="mt-auto border-t border-slate-800 pt-5 leading-7 text-slate-500">Operations console<br />Internal use</small>
      <button className="absolute right-4 top-5 text-2xl text-slate-500 transition hover:text-white" onClick={onClose} type="button" aria-label="Close navigation">&times;</button>
    </aside>
    {open && <button className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} type="button" aria-label="Close navigation overlay" />}
  </>
);

export default Sidebar;
