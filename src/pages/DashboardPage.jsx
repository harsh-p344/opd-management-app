import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/dashboardService';
import { DashboardHeader, DashboardPanels, Sidebar, StatCard } from '../components/dashboard';

const initialStats = { totalPatients: 0, totalMedicines: 0, expiredMedicines: 0, lowStock: 0 };
const statCards = [
  ['Total patients', 'totalPatients', 'Registered OPD records', 'cyan'],
  ['Total medicines', 'totalMedicines', 'Tracked inventory items', 'slate'],
  ['Expired medicines', 'expiredMedicines', 'Requires stock review', 'red'],
  ['Low stock', 'lowStock', 'At reorder level', 'amber'],
];

const DashboardPage = () => {
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
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
      <main className="min-w-0 flex-1 bg-slate-50 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px]">
        <DashboardHeader active={active} onOpenMenu={() => setMenuOpen(true)} />
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          {status === 'error' && <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm" role="alert">Dashboard data could not be loaded.</div>}
          <section className="grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
            {statCards.map(([label, key, note, tone]) => <StatCard key={key} label={label} value={value(stats[key])} note={note} tone={tone} />)}
          </section>
          <DashboardPanels />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
