import { useEffect, useState } from 'react';
import { DashboardHeader, Sidebar } from '../components/dashboard';
import { fetchMedicines } from '../services/medicineService';
import { createPatientRecord, fetchPatients } from '../services/patientRecordService';

const blankMedicineRow = () => ({
  medicineId: '',
  medicineName: '',
  quantity: 1,
  dosage: '',
});

const initialForm = {
  patientName: '',
  patientType: 'employee',
  employeeCode: '',
  department: '',
  age: '',
  gender: 'male',
  complaint: '',
  caseType: '',
  severity: '',
  caseSummary: '',
  vitals: '',
  treatmentSummary: '',
  doctor: '',
  followUpSchedule: '',
  remarks: '',
  medicines: [blankMedicineRow()],
};

const fieldClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white/90 px-3 text-sm text-slate-700 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:ring-3 focus:ring-sky-100';
const cellClass = 'rounded-2xl border p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md';

const getSeverityTone = (severity = '') => ({
  low: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  medium: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  high: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
}[severity] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200');

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const OPDPage = () => {
  const [active, setActive] = useState('Patients');
  const [menuOpen, setMenuOpen] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async (page = 1) => {
    try {
      const [medicineResult, patientResult] = await Promise.all([
        fetchMedicines({ limit: 100 }),
        fetchPatients({ page, limit: 10 }),
      ]);

      setMedicineOptions(medicineResult.medicines || []);
      setPatients(patientResult.patients || []);
      setPagination({
        page: patientResult.page || page,
        limit: patientResult.limit || 10,
        total: patientResult.total || 0,
        totalPages: patientResult.totalPages || 0,
      });
      setStatus('ready');
    } catch {
      setStatus('error');
      setError('Patient data could not be loaded.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changePage = async (page) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) return;
    setStatus('loading');
    await loadData(page);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateMedicineRow = (index, field, value) => {
    setForm((current) => {
      const nextMedicines = [...current.medicines];
      nextMedicines[index] = {
        ...nextMedicines[index],
        [field]: value,
      };

      if (field === 'medicineId') {
        const selected = medicineOptions.find((medicine) => medicine._id === value);
        nextMedicines[index].medicineName = selected ? selected.name : '';
      }

      return { ...current, medicines: nextMedicines };
    });
  };

  const addMedicineRow = () => {
    setForm((current) => ({
      ...current,
      medicines: [...current.medicines, blankMedicineRow()],
    }));
  };

  const removeMedicineRow = (indexToRemove) => {
    setForm((current) => ({
      ...current,
      medicines: current.medicines.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        age: form.age === '' ? 0 : Number(form.age),
        medicines: form.medicines.filter((item) => item.medicineId && item.quantity > 0),
      };

      await createPatientRecord(payload);
      setForm(initialForm);
      await loadData(1);
    } catch (submitError) {
      setError(submitError.message || 'Unable to save patient record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-700">
      <Sidebar active={active} open={menuOpen} onSelect={setActive} onClose={() => setMenuOpen(false)} />

      <main className={`min-w-0 flex-1 bg-slate-50 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:26px_26px] transition-[margin] duration-300 ${menuOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <DashboardHeader active={active} onOpenMenu={() => setMenuOpen(true)} />

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[28px] border border-sky-200/80 bg-white/90 shadow-[0_0_0_1px_rgba(56,189,248,0.1),0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-violet-300/20 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.2),0_24px_80px_rgba(14,165,233,0.12)]">
            <div className="border-b border-slate-800 bg-[linear-gradient(110deg,#020617,#0f172a_60%,#111827)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300 sm:px-6">
              OPD registration
            </div>

            <div className="space-y-4 p-4 sm:p-5 lg:p-5">
              <div className="grid items-stretch gap-4 lg:grid-cols-3">
                <section className={`${cellClass} flex h-full flex-col border-sky-200 bg-sky-50/80 lg:min-h-[390px]`}>
                  <div className="mb-4 flex min-h-10 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sky-200 text-xs font-bold text-sky-800">01</span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-700">Patient details</h3>
                      <p className="mt-0.5 text-xs text-sky-700/80">Basic identity and department</p>
                    </div>
                  </div>
                  <div className="grid flex-1 content-start gap-x-3 gap-y-3 sm:grid-cols-2">
                    <label className="space-y-1.5 text-xs font-medium sm:col-span-2">
                      <span className="text-slate-600">Patient name</span>
                      <input value={form.patientName} onChange={(event) => updateField('patientName', event.target.value)} className={fieldClass} required />
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Patient type</span>
                      <select value={form.patientType} onChange={(event) => updateField('patientType', event.target.value)} className={fieldClass}>
                        <option value="employee">Employee</option>
                        <option value="contract">Contract</option>
                        <option value="trainee">Trainee</option>
                      </select>
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Employee code</span>
                      <input value={form.employeeCode} onChange={(event) => updateField('employeeCode', event.target.value)} className={fieldClass} />
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Department</span>
                      <input value={form.department} onChange={(event) => updateField('department', event.target.value)} className={fieldClass} />
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Age</span>
                      <input type="number" min="0" value={form.age} onChange={(event) => updateField('age', event.target.value)} className={fieldClass} />
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Gender</span>
                      <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)} className={fieldClass}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="">Prefer not to say</option>
                      </select>
                    </label>
                  </div>
                </section>

                <section className={`${cellClass} flex h-full flex-col border-violet-200 bg-violet-50/80 lg:min-h-[390px]`}>
                  <div className="mb-4 flex min-h-10 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet-200 text-xs font-bold text-violet-800">02</span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-violet-700">Clinical details</h3>
                      <p className="mt-0.5 text-xs text-violet-700/80">Symptoms, assessment and vitals</p>
                    </div>
                  </div>
                  <div className="grid flex-1 content-start gap-3">
                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Complaint</span>
                      <input value={form.complaint} onChange={(event) => updateField('complaint', event.target.value)} className={fieldClass} required />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Case type</span>
                        <input value={form.caseType} onChange={(event) => updateField('caseType', event.target.value)} className={fieldClass} />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Severity</span>
                        <select value={form.severity} onChange={(event) => updateField('severity', event.target.value)} className={fieldClass}>
                          <option value="">Select</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </label>
                    </div>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Case summary</span>
                      <input value={form.caseSummary} onChange={(event) => updateField('caseSummary', event.target.value)} className={fieldClass} />
                    </label>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Vitals</span>
                      <input value={form.vitals} onChange={(event) => updateField('vitals', event.target.value)} className={fieldClass} />
                    </label>
                  </div>
                </section>

                <section className={`${cellClass} flex h-full flex-col border-emerald-200 bg-emerald-50/80 lg:min-h-[390px]`}>
                  <div className="mb-4 flex min-h-10 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-200 text-xs font-bold text-emerald-800">03</span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-700">Treatment plan</h3>
                      <p className="mt-0.5 text-xs text-emerald-700/80">Care details and follow-up</p>
                    </div>
                  </div>
                  <div className="grid flex-1 content-start gap-3">
                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Treatment summary</span>
                      <input value={form.treatmentSummary} onChange={(event) => updateField('treatmentSummary', event.target.value)} className={fieldClass} />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Doctor</span>
                        <input value={form.doctor} onChange={(event) => updateField('doctor', event.target.value)} className={fieldClass} />
                      </label>

                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Follow-up</span>
                        <input type="date" value={form.followUpSchedule} onChange={(event) => updateField('followUpSchedule', event.target.value)} className={fieldClass} />
                      </label>
                    </div>

                    <label className="space-y-1.5 text-xs font-medium">
                      <span className="text-slate-600">Remarks</span>
                      <textarea value={form.remarks} onChange={(event) => updateField('remarks', event.target.value)} rows="3" className={`${fieldClass} h-auto min-h-24 resize-y py-2.5`} />
                    </label>
                  </div>
                </section>
              </div>

              <section className={`${cellClass} border-amber-200 bg-amber-50/80 p-4 sm:p-5`}>
                <div className="mb-3 flex min-h-10 items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-200 text-xs font-bold text-amber-800">04</span>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-800">Medicines prescribed</h3>
                      <p className="mt-0.5 text-xs text-amber-700/80">Select medicine, quantity and dosage</p>
                    </div>
                  </div>
                  <button type="button" onClick={addMedicineRow} className="rounded-xl border border-amber-300 bg-white/80 px-3 py-2 text-sm font-semibold text-amber-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-amber-100">+ Add medicine</button>
                </div>

                <div className="space-y-2">
                  {form.medicines.map((medicine, index) => (
                    <div key={`${medicine.medicineId || 'new'}-${index}`} className="grid items-end gap-x-4 gap-y-3 border-b border-amber-200/80 py-3 last:border-b-0 md:grid-cols-[1.5fr_0.65fr_0.9fr_auto]">
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Medicine</span>
                        <select value={medicine.medicineId} onChange={(event) => updateMedicineRow(index, 'medicineId', event.target.value)} className={fieldClass}>
                          <option value="">Select medicine</option>
                          {medicineOptions.map((option) => <option key={option._id} value={option._id}>{option.name}</option>)}
                        </select>
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Quantity</span>
                        <input type="number" min="1" value={medicine.quantity} onChange={(event) => updateMedicineRow(index, 'quantity', Number(event.target.value) || 1)} className={fieldClass} />
                      </label>
                      <label className="space-y-1.5 text-xs font-medium">
                        <span className="text-slate-600">Dosage</span>
                        <input value={medicine.dosage} onChange={(event) => updateMedicineRow(index, 'dosage', event.target.value)} placeholder="e.g. 1 tablet twice daily" className={fieldClass} />
                      </label>
                      <button type="button" onClick={() => removeMedicineRow(index)} className="h-10 rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100">Remove</button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-center pt-2">
                <button type="submit" disabled={isSaving} className="group inline-flex min-w-52 items-center justify-center gap-2 rounded-xl border border-teal-500/70 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(8,145,178,0.25)] transition duration-200 hover:-translate-y-0.5 hover:from-teal-500 hover:via-cyan-500 hover:to-sky-500 hover:shadow-[0_12px_30px_rgba(8,145,178,0.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-wait disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-500 disabled:shadow-none">
                  {!isSaving && <span aria-hidden="true" className="text-base transition-transform group-hover:scale-110">✓</span>}
                  {isSaving ? 'Saving record…' : 'Save OPD record'}
                </button>
              </div>
            </div>
          </form>

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Recent OPD patients</div>

            {status === 'loading' ? (
              <div className="px-4 py-8 text-center text-slate-500">Loading records…</div>
            ) : status === 'error' ? (
              <div className="px-4 py-8 text-center text-rose-600">Unable to load patient records.</div>
            ) : (
              <div className="max-h-[560px] overflow-auto">
                <table className="w-full min-w-[1800px] table-fixed border-collapse text-left text-xs">
                  <colgroup>
                    <col className="w-40" /><col className="w-24" /><col className="w-28" /><col className="w-32" /><col className="w-28" />
                    <col className="w-40" /><col className="w-28" /><col className="w-24" /><col className="w-44" /><col className="w-36" />
                    <col className="w-44" /><col className="w-32" /><col className="w-32" /><col className="w-48" /><col className="w-44" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 shadow-sm">
                    <tr className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      <th colSpan="5" className="border-r border-white/20 bg-sky-700 px-3 py-2.5">Patient details</th>
                      <th colSpan="5" className="border-r border-white/20 bg-violet-700 px-3 py-2.5">Clinical assessment</th>
                      <th colSpan="5" className="bg-emerald-700 px-3 py-2.5">Treatment plan</th>
                    </tr>
                    <tr className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                      {['Patient', 'Type', 'Code', 'Department', 'Age / gender'].map((label) => <th key={label} className="border border-sky-100 bg-sky-50 px-3 py-2.5">{label}</th>)}
                      {['Complaint', 'Case type', 'Severity', 'Case summary', 'Vitals'].map((label) => <th key={label} className="border border-violet-100 bg-violet-50 px-3 py-2.5">{label}</th>)}
                      {['Treatment', 'Doctor', 'Follow-up', 'Medicines', 'Remarks'].map((label) => <th key={label} className="border border-emerald-100 bg-emerald-50 px-3 py-2.5">{label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length === 0 ? (
                      <tr><td colSpan="15" className="px-4 py-10 text-center text-slate-500">No OPD records yet.</td></tr>
                    ) : patients.map((patient) => {
                      const record = patient.latestRecord || {};
                      const medicineSummary = (record.medicines || []).map((item) => `${item.medicineName || 'Medicine'} ×${item.quantity || 0}${item.dosage ? ` · ${item.dosage}` : ''}`).join('; ') || '—';
                      const patientCell = 'border border-slate-200 px-3 py-3 align-top';
                      return (
                        <tr key={patient._id} className="odd:bg-white even:bg-slate-50/80 hover:bg-sky-50/70">
                          <td className={`${patientCell} border-l-4 border-l-sky-400`}><div className="font-semibold text-slate-900">{patient.patientName}</div></td>
                          <td className={`${patientCell} capitalize text-sky-800`}>{patient.patientType || '—'}</td>
                          <td className={patientCell}>{patient.employeeCode || '—'}</td>
                          <td className={patientCell}>{patient.department || '—'}</td>
                          <td className={patientCell}>{patient.age ? `${patient.age} yrs` : '—'} <span className="text-slate-400">·</span> <span className="capitalize">{patient.gender || '—'}</span></td>
                          <td className={`${patientCell} border-l-2 border-l-violet-200 font-medium text-slate-800`}>{record.complaint || '—'}</td>
                          <td className={patientCell}>{record.caseType || '—'}</td>
                          <td className={patientCell}>{record.severity ? <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${getSeverityTone(record.severity)}`}>{record.severity}</span> : '—'}</td>
                          <td className={`${patientCell} whitespace-normal break-words text-slate-600`}>{record.caseSummary || '—'}</td>
                          <td className={`${patientCell} whitespace-normal break-words text-slate-600`}>{record.vitals || '—'}</td>
                          <td className={`${patientCell} border-l-2 border-l-emerald-200 whitespace-normal break-words text-slate-700`}>{record.treatmentSummary || '—'}</td>
                          <td className={patientCell}>{record.doctor || '—'}</td>
                          <td className={patientCell}>{record.followUpSchedule ? formatDate(record.followUpSchedule) : '—'}</td>
                          <td className={`${patientCell} whitespace-normal break-words text-amber-800`}>{medicineSummary}</td>
                          <td className={`${patientCell} whitespace-normal break-words text-slate-600`}>{record.remarks || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {status === 'ready' && pagination.total > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} patients
                </p>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <button type="button" onClick={() => changePage(pagination.page - 1)} disabled={pagination.page <= 1} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                  <span className="min-w-20 text-center text-xs font-medium text-slate-600">Page {pagination.page} of {pagination.totalPages}</span>
                  <button type="button" onClick={() => changePage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OPDPage;
