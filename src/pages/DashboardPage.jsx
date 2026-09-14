import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/dashboardService';
import { DashboardHeader, DashboardPanels, Sidebar, StatCard } from '../components/dashboard';

const initialStats = { totalPatients: 0, totalMedicines: 0, expiredMedicines: 0, lowStock: 0 };
const statCards = [
  ['Total patients', 'totalPatients', 'Registered OPD records', 'cyan'],
  ['Low stock', 'lowStock', 'At reorder level', 'amber'],
  ['Total medicines', 'totalMedicines', 'Tracked inventory items', 'slate'],
  ['Expired medicines', 'expiredMedicines', 'Requires stock review', 'red'],
];

const DashboardPage = () => {
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(() => window.innerWidth >= 1024);
  const [stats, setStats] = useState(initialStats);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => { setStats((current) => ({ ...current, ...data })); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  const selectNav = (item) => { setActive(item); setMenuOpen(false); };
  const value = (number) => status === 'loading' ? '—' : number;

  return (
    <div className="flex min-h-screen bg-white text-slate-700">
      <Sidebar active={active} open={menuOpen} onSelect={selectNav} onClose={() => setMenuOpen(false)} />
      <main className={`dashboard-grid-bg relative min-w-0 flex-1 overflow-hidden bg-slate-50 transition-[margin] duration-300 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px] ${menuOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <DashboardHeader active={active} onOpenMenu={() => setMenuOpen(true)} />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute left-1/2 top-16 h-px w-1/2 overflow-hidden bg-sky-100/70"><span className="dashboard-sweep block h-full w-1/4 bg-sky-400/70" /></div>
          {status === 'error' && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm" role="alert">Dashboard data could not be loaded.</div>}
          <section className="grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
            {statCards.map(([label, key, note, tone], index) => <StatCard key={key} label={label} value={value(stats[key])} note={note} tone={tone} delay={index} />)}
          </section>
          <DashboardPanels />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
