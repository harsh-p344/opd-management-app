import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../services/dashboardService';
import { DashboardHeader, DashboardPanels, Sidebar, StatCard } from '../components/dashboard';

const INITIAL_STATS = {
  totalPatients: 0,
  totalMedicines: 0,
  expiredMedicines: 0,
  lowStock: 0,
};

const STAT_CARDS = [
  { key: 'totalPatients', label: 'Total Patients', note: 'Registered OPD records', tone: 'cyan' },
  { key: 'lowStock', label: 'Low Stock', note: 'At reorder level', tone: 'amber' },
  { key: 'totalMedicines', label: 'Total Medicines', note: 'Tracked inventory items', tone: 'slate' },
  { key: 'expiredMedicines', label: 'Expired Medicines', note: 'Requires stock review', tone: 'red' },
];

const STATUS = { LOADING: 'loading', READY: 'ready', ERROR: 'error' };

const DashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [status, setStatus] = useState(STATUS.LOADING);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        if (cancelled) return;
        setStats((prev) => ({ ...prev, ...data }));
        setStatus(STATUS.READY);
      } catch {
        if (!cancelled) setStatus(STATUS.ERROR);
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, []);

  const handleNavSelect = (item) => {
    setActiveNav(item);
    setIsSidebarOpen(false);
  };

  const displayValue = (value) => (status === STATUS.LOADING ? '—' : value);

  return (
    <div className="flex min-h-screen bg-white text-slate-700">
      <Sidebar
        active={activeNav}
        open={isSidebarOpen}
        onSelect={handleNavSelect}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`
          relative min-w-0 flex-1 overflow-hidden bg-slate-50
          transition-[margin] duration-300 ease-out
          [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)]
          [background-size:32px_32px]
          ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
        `}
      >
        <DashboardHeader active={activeNav} onOpenMenu={() => setIsSidebarOpen(true)} />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          {/* decorative accent line */}
          <div className="pointer-events-none absolute left-1/2 top-16 h-px w-1/2 -translate-x-1/2 overflow-hidden bg-sky-100/70">
            <span className="dashboard-sweep block h-full w-1/4 bg-sky-400/70" />
          </div>

          {status === STATUS.ERROR && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm"
            >
              <span aria-hidden="true">⚠</span>
              Dashboard data could not be loaded. Please try refreshing.
            </div>
          )}

          <section
            className="grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Key metrics"
          >
            {STAT_CARDS.map(({ key, label, note, tone }, index) => (
              <StatCard
                key={key}
                label={label}
                value={displayValue(stats[key])}
                note={note}
                tone={tone}
                delay={index}
              />
            ))}
          </section>

          <DashboardPanels />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;