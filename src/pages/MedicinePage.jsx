import { useEffect, useMemo, useState } from 'react';
import { DashboardHeader, Sidebar, StatCard } from '../components/dashboard';
import { fetchMedicines } from '../services/medicineService';

const defaultFilters = {
  search: '',
  category: '',
  stockStatus: '',
  expiryStatus: '',
  page: 1,
  limit: 10,
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const batchTone = (expiryStatus) => ({
  expired: 'border-rose-200 bg-rose-50 text-rose-700',
  near: 'border-amber-200 bg-amber-50 text-amber-700',
  valid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}[expiryStatus] || 'border-slate-200 bg-slate-50 text-slate-500');

const MobileMedicineCard = ({ medicine }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-slate-900">{medicine.name}</h3>
        <p className="mt-1 truncate text-xs text-slate-500">{medicine.genericName || 'Generic name not set'}</p>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${medicine.stockStatus === 'low' ? 'bg-amber-100 text-amber-700' : medicine.stockStatus === 'out' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{medicine.stockStatus}</span>
    </div>
    <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center">
      <div><span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Stock</span><strong className="mt-1 block text-sm text-slate-800">{medicine.totalStock ?? 0}</strong></div>
      <div><span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Reorder</span><strong className="mt-1 block text-sm text-slate-800">{medicine.reorderLevel ?? 0}</strong></div>
      <div><span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Unit</span><strong className="mt-1 block truncate px-1 text-sm text-slate-800">{medicine.unit}</strong></div>
    </div>
    <div className="mt-4 space-y-2">
      {medicine.batches?.slice(0, 3).map((batch, index) => (
        <div key={batch._id || batch.batchNumber} className={`rounded-xl border p-3 ${batchTone(medicine.expiryStatus)}`}>
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold">Batch {index + 1} · {batch.batchNumber}</span><span className="text-[10px] font-medium uppercase">{formatDate(batch.expiryDate)}</span></div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs"><span>Qty <b>{batch.quantity}</b></span><span>Cost <b>{batch.purchasePrice}</b></span></div>
          <div className="mt-2 border-t border-current/15 pt-2 text-[11px] leading-5">{batch.supplierName} · Purchased {formatDate(batch.purchaseDate)}</div>
        </div>
      ))}
    </div>
  </article>
);

const MedicinePage = () => {
  const [active, setActive] = useState('Medicines');
  const [menuOpen, setMenuOpen] = useState(() => window.innerWidth >= 1024);
  const [filters, setFilters] = useState(defaultFilters);
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({ medicines: [], total: 0, page: 1, limit: 10, totalPages: 1 });

  useEffect(() => {
    const controller = new AbortController();

    fetchMedicines({ ...filters })
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus('error');
        }
      });

    return () => controller.abort();
  }, [filters]);

  const summary = useMemo(() => {
    const total = data.total || data.medicines.length;
    const lowStock = data.medicines.filter((item) => item.stockStatus === 'low').length;
    const nearExpiry = data.medicines.filter((item) => item.expiryStatus === 'near').length;
    const expired = data.medicines.filter((item) => item.expiryStatus === 'expired').length;

    return { total, lowStock, nearExpiry, expired };
  }, [data]);

  const statCards = [
    ['Total medicines', summary.total, 'Tracked inventory items', 'cyan'],
    ['Low stock', summary.lowStock, 'At reorder level', 'amber'],
    ['Near expiry', summary.nearExpiry, 'Within 30 days', 'slate'],
    ['Expired', summary.expired, 'Requires action', 'red'],
  ];

  const updateFilter = (changes) => {
    setFilters((current) => ({
      ...current,
      ...changes,
      page: 1,
    }));
  };

  const selectNav = (item) => {
    setActive(item);
    setMenuOpen(false);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > data.totalPages) return;
    setFilters((current) => ({ ...current, page: nextPage }));
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-700">
      <Sidebar active={active} open={menuOpen} onSelect={selectNav} onClose={() => setMenuOpen(false)} />
      <main className={`min-w-0 flex-1 bg-slate-50 transition-[margin] duration-300 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:32px_32px] ${menuOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <DashboardHeader active={active} onOpenMenu={() => setMenuOpen(true)} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          {status === 'error' && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm" role="alert">
              Medicines data could not be loaded.
            </div>
          )}

          <section className="grid auto-rows-fr items-stretch gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4" aria-label="Medicine stock overview">
            {statCards.map(([label, value, note, tone]) => (
              <StatCard key={label} label={label} value={status === 'loading' ? '—' : value} note={note} tone={tone} />
            ))}
          </section>

          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-10">
            <div className="flex flex-col gap-3 border-b border-slate-800 bg-[linear-gradient(110deg,#020617,#0f172a_65%,#111827)] px-4 py-3 sm:gap-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" /><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">Inventory control</p></div>
                <h2 className="mt-0.5 text-base font-semibold tracking-tight text-white sm:text-lg">Medicine inventory</h2>
                <p className="hidden text-[11px] text-slate-400 sm:block">Search and review active stock batches.</p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:flex lg:flex-wrap lg:justify-end">
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter({ search: event.target.value })}
                  placeholder="Search medicines"
                  className="h-10 min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
                />
                <select
                  value={filters.category}
                  onChange={(event) => updateFilter({ category: event.target.value })}
                  className="h-10 min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
                >
                  <option value="">All categories</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Painkiller">Painkiller</option>
                  <option value="Vitamin">Vitamin</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={filters.stockStatus}
                  onChange={(event) => updateFilter({ stockStatus: event.target.value })}
                  className="h-10 min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
                >
                  <option value="">Stock status</option>
                  <option value="low">Low stock</option>
                  <option value="out">Out of stock</option>
                  <option value="ok">Healthy</option>
                </select>
                <select
                  value={filters.expiryStatus}
                  onChange={(event) => updateFilter({ expiryStatus: event.target.value })}
                  className="h-10 min-w-0 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
                >
                  <option value="">Expiry status</option>
                  <option value="expired">Expired</option>
                  <option value="near">Near expiry</option>
                  <option value="valid">Valid</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/60 p-4 sm:hidden">
              {status === 'loading' ? <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">Loading medicines…</div> : data.medicines.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">No medicines found.</div> : data.medicines.map((medicine) => <MobileMedicineCard key={medicine._id} medicine={medicine} />)}
            </div>

            <div className="dashboard-scroll hidden h-[370px] w-full overflow-y-auto overflow-x-hidden sm:block">
              <table className="min-w-[920px] border-collapse text-left text-xs sm:w-full sm:min-w-0 sm:table-fixed">
                <colgroup>
                  <col className="w-[17%]" />
                  <col className="w-[9%]" />
                  <col className="w-[7%]" />
                  <col className="w-[8%]" />
                  <col className="w-[9%]" />
                  <col className="w-[16.5%]" />
                  <col className="w-[16.5%]" />
                  <col className="w-[17%]" />
                </colgroup>
                <thead className="sticky top-0 z-10 border-b-2 border-slate-200 bg-slate-100 text-slate-600 shadow-[0_1px_0_rgba(148,163,184,0.2)]">
                  <tr>
                    <th className="px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide">Medicine</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide">Category</th>
                    <th className="px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide">Unit</th>
                    <th className="px-2 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wide">Stock</th>
                    <th className="px-2 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wide">Reorder</th>
                    {[1, 2, 3].map((batchNumber) => <th key={batchNumber} className="px-2 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-sky-700">Batch {batchNumber}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan="8" className="border-b border-slate-100 px-5 py-12 text-center text-slate-500">Loading medicines…</td>
                    </tr>
                  ) : data.medicines.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="border-b border-slate-100 px-5 py-12 text-center text-slate-500">No medicines found.</td>
                    </tr>
                  ) : (
                    data.medicines.map((medicine) => (
                      <tr key={medicine._id} className="group border-b border-slate-100 odd:bg-white even:bg-slate-50/45 hover:bg-sky-50/50">
                        <td className="align-top break-words px-3 py-2">
                          <div className="font-medium text-slate-900">{medicine.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{medicine.genericName || 'Generic name not set'}</div>
                        </td>
                        <td className="align-top break-words px-3 py-2 text-slate-600">{medicine.category || '—'}</td>
                        <td className="align-top break-words px-3 py-2 text-slate-600">{medicine.unit}</td>
                        <td className="align-top px-3 py-2 text-right font-medium tabular-nums text-slate-700">{medicine.totalStock ?? 0}</td>
                        <td className="align-top px-3 py-2 text-right tabular-nums text-slate-700">{medicine.reorderLevel ?? 0}</td>
                        {[0, 1, 2].map((batchIndex) => {
                          const batch = medicine.batches?.[batchIndex];
                          return (
                            <td key={batchIndex} className="align-top px-2 py-2">
                              {batch ? (
                                <div className={`rounded-lg border px-2 py-2 transition duration-200 group-hover:shadow-sm ${batchTone(medicine.expiryStatus)}`}>
                                  <div className="flex items-center justify-between gap-2 border-b border-current/15 pb-1"><span className="font-semibold">{batch.batchNumber}</span><span className="rounded bg-white/60 px-1 py-0.5 text-[9px] font-semibold uppercase">Batch</span></div>
                                  <dl className="mt-1 grid grid-cols-2 gap-1 text-[11px] leading-4">
                                    <div><dt className="block text-[10px] font-medium uppercase opacity-70">Qty</dt><dd className="font-semibold">{batch.quantity}</dd></div>
                                    <div><dt className="block text-[10px] font-medium uppercase opacity-70">Cost</dt><dd className="font-semibold">{batch.purchasePrice}</dd></div>
                                  </dl>
                                  <dl className="mt-1 grid gap-0.5 border-t border-current/15 pt-1 text-[10px] leading-4">
                                    <div><dt className="inline font-medium">Purchased:</dt> <dd className="inline">{formatDate(batch.purchaseDate)}</dd></div>
                                    <div><dt className="inline font-medium">Supplier:</dt> <dd className="inline">{batch.supplierName}</dd></div>
                                    <div><dt className="inline font-medium">Expires:</dt> <dd className="inline">{formatDate(batch.expiryDate)}</dd></div>
                                  </dl>
                                </div>
                              ) : <span className="text-slate-400">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data.total > 0 && (
              <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-600">
                  Showing {data.medicines.length} of {data.total} medicines
                </p>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handlePageChange(data.page - 1)}
                    disabled={data.page === 1}
                    className="h-9 min-w-16 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="min-w-24 text-center text-sm text-slate-600">Page {data.page} / {data.totalPages}</span>
                  <button
                    type="button"
                    onClick={() => handlePageChange(data.page + 1)}
                    disabled={data.page >= data.totalPages}
                    className="h-9 min-w-16 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MedicinePage;
