import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import Patient from '../models/Patient.js';
import PatientRecord from '../models/PatientRecord.js';

const MAX_MEDS = 15;
const MAX_RECORDS = 50;

// Small helper: throw an error with an HTTP status attached.
const fail = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const posInt = (value, fallback) => {
  const n = Number(value ?? fallback);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

const safeNum = (value, fallback = 0) => {
  const n = Number(value ?? fallback);
  return Number.isFinite(n) ? n : fallback;
};

const nullableAge = (value) => {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 130 ? n : null;
};

// Escape regex metachars so ".*" can't scan the whole collection.
const buildSearchQuery = ({ search = '' } = {}) => {
  const term = String(search).trim();
  if (!term) return {};
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    $or: [
      { patientName: { $regex: escaped, $options: 'i' } },
      { employeeCode: { $regex: escaped, $options: 'i' } },
      { department: { $regex: escaped, $options: 'i' } },
    ],
  };
};

// Merge duplicate medicine IDs in one request into a single line.
const coalesceMedicines = (medicines) => {
  const byId = new Map();
  for (const item of medicines) {
    const medicineId = String(item?.medicineId || '').trim();
    const quantity = safeNum(item?.quantity, 0);
    const dosage = String(item?.dosage || '').trim();

    if (!mongoose.isValidObjectId(medicineId)) fail('Invalid medicine ID', 400);
    if (!Number.isInteger(quantity) || quantity <= 0) fail('Quantity must be a positive whole number', 400);

    const existing = byId.get(medicineId);
    if (existing) {
      existing.quantity += quantity;
      if (dosage) existing.dosage = existing.dosage ? `${existing.dosage}; ${dosage}` : dosage;
    } else {
      byId.set(medicineId, { medicineId, quantity, dosage });
    }
  }
  return [...byId.values()];
};

// FEFO: pick which batches to take from, earliest expiry first.
const planAllocations = (medicine, quantity) => {
  const now = new Date();
  let remaining = quantity;
  const allocations = [];

  const eligible = [...(medicine.batches || [])]
    .filter((b) => b && b.quantity > 0 && new Date(b.expiryDate) > now)
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  for (const batch of eligible) {
    if (remaining <= 0) break;
    const take = Math.min(batch.quantity, remaining);
    allocations.push({ batchId: batch._id, quantity: take });
    remaining -= take;
  }
  if (remaining > 0) fail(`Insufficient stock for ${medicine.name}`, 400);
  return allocations;
};

// Deduct stock for one medicine. Each batch $inc has a $gte guard so two
// concurrent requests can't oversell the same batch.
const deductStock = async (medicineId, quantity, session) => {
  const medicine = await Medicine.findById(medicineId).session(session);
  if (!medicine) fail('Medicine not found', 404);

  const allocations = planAllocations(medicine, quantity);

  for (const a of allocations) {
    const result = await Medicine.updateOne(
      { _id: medicine._id, 'batches._id': a.batchId, 'batches.quantity': { $gte: a.quantity } },
      { $inc: { 'batches.$.quantity': -a.quantity, totalStock: -a.quantity } },
      { session }
    );
    if (result.modifiedCount !== 1) fail(`Stock changed while dispensing ${medicine.name}; retry`, 409);
  }
  return { medicineName: medicine.name, allocations };
};

export const listPatients = async (filters = {}) => {
  const page = posInt(filters.page, 1);
  const limit = posInt(filters.limit, 20);
  const query = buildSearchQuery(filters);

  const total = await Patient.countDocuments(query);
  const patients = await Patient.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

  const ids = patients.map((p) => p._id);
  const latest = ids.length
    ? await PatientRecord.aggregate([
        { $match: { patientId: { $in: ids }, deletedAt: null } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$patientId', latest: { $first: '$$ROOT' } } },
      ])
    : [];
  const byPatient = new Map(latest.map(({ _id, latest: record }) => [String(_id), record]));

  return {
    patients: patients.map((p) => ({ ...p.toObject(), latestRecord: byPatient.get(String(p._id)) || null })),
    page, limit, total, totalPages: Math.ceil(total / limit),
  };
};

export const getPatientById = async (id, filters = {}) => {
  if (!mongoose.isValidObjectId(id)) fail('Invalid patient id', 400);

  const recordLimit = Math.min(posInt(filters.recordLimit, 20), MAX_RECORDS);
  const patient = await Patient.findById(id).lean();
  if (!patient) fail('Patient not found', 404);

  const records = await PatientRecord.find({ patientId: patient._id, deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(recordLimit)
    .lean();

  return { ...patient, records };
};

export const createPatientRecord = async (payload = {}, createdBy = null) => {
  if (!createdBy || !mongoose.isValidObjectId(createdBy)) fail('A valid createdBy user id is required', 500);

  const patientName = String(payload.patientName || '').trim();
  const complaint = String(payload.complaint || '').trim();
  if (!patientName || !complaint) fail('Patient name and complaint are required', 400);

  const rawMedicines = Array.isArray(payload.medicines) ? payload.medicines : [];
  if (!rawMedicines.length) fail('At least one medicine is required', 400);
  if (rawMedicines.length > MAX_MEDS) fail(`Too many medicines (max ${MAX_MEDS})`, 400);

  const medicines = coalesceMedicines(rawMedicines);
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      // Only fields the client actually sent can overwrite patient identity.
      const patch = {};
      if (payload.patientName !== undefined) patch.patientName = patientName;
      if (payload.patientType !== undefined) patch.patientType = String(payload.patientType || 'employee').trim() || 'employee';
      if (payload.employeeCode !== undefined) patch.employeeCode = String(payload.employeeCode || '').trim();
      if (payload.department !== undefined) patch.department = String(payload.department || '').trim();
      if (payload.age !== undefined) patch.age = nullableAge(payload.age);
      if (payload.gender !== undefined) patch.gender = String(payload.gender || '').trim();

      // Reuse an existing patient by id, or by employee code to avoid duplicates.
      let patient = null;
      if (payload.patientId) {
        if (!mongoose.isValidObjectId(payload.patientId)) fail('Invalid patient id', 400);
        patient = await Patient.findById(payload.patientId).session(session);
        if (!patient) fail('Patient not found', 404);
      } else if (patch.employeeCode) {
        patient = await Patient.findOne({ employeeCode: patch.employeeCode }).session(session);
      }

      if (patient) {
        Object.assign(patient, patch);
        await patient.save({ session });
      } else {
        [patient] = await Patient.create([{
          patientName,
          patientType: patch.patientType || 'employee',
          employeeCode: patch.employeeCode || '',
          department: patch.department || '',
          age: patch.age ?? null,
          gender: patch.gender || '',
        }], { session });
      }

      const preparedMedicines = [];
      for (const item of medicines) {
        const { medicineName, allocations } = await deductStock(item.medicineId, item.quantity, session);
        preparedMedicines.push({ ...item, medicineName, batchAllocations: allocations });
      }

      const [record] = await PatientRecord.create([{
        patientId: patient._id, createdBy, complaint,
        caseType: String(payload.caseType || '').trim(),
        severity: String(payload.severity || '').trim(),
        caseSummary: String(payload.caseSummary || '').trim(),
        vitals: String(payload.vitals || '').trim(),
        treatmentSummary: String(payload.treatmentSummary || '').trim(),
        doctor: String(payload.doctor || '').trim(),
        followUpSchedule: String(payload.followUpSchedule || '').trim(),
        remarks: String(payload.remarks || '').trim(),
        medicines: preparedMedicines,
      }], { session });

      return { patient, record };
    });
  } finally {
    await session.endSession();
  }
};

export const deletePatientRecord = async (id, deletedBy = null) => {
  if (!mongoose.isValidObjectId(id)) fail('Invalid record id', 400);
  if (!deletedBy || !mongoose.isValidObjectId(deletedBy)) fail('A valid deletedBy user id is required', 500);

  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const record = await PatientRecord.findOne({ _id: id, deletedAt: null }).session(session);
      if (!record) fail('Patient record not found', 404);

      const now = new Date();

      // Put the stock back where it came from, batch by batch.
      for (const item of record.medicines || []) {
        if (!item.batchAllocations?.length) {
          fail(`Cannot restore stock for legacy record: ${item.medicineName}`, 409);
        }

        for (const a of item.batchAllocations) {
          const medicine = await Medicine.findById(item.medicineId).session(session);
          if (!medicine) fail(`Medicine no longer exists: ${item.medicineName}`, 409);
          const batch = medicine.batches?.id(a.batchId);
          if (!batch) fail(`Inventory batch not found for ${item.medicineName}`, 409);

          // Restore batch count always; totalStock only if still unexpired, so
          // the invariant "totalStock == sum of unexpired batches" holds.
          const inc = { 'batches.$.quantity': a.quantity };
          if (new Date(batch.expiryDate) > now) inc.totalStock = a.quantity;
          await Medicine.updateOne(
            { _id: item.medicineId, 'batches._id': a.batchId },
            { $inc: inc },
            { session }
          );
        }
      }

      // Soft delete: keep the record for audit, mark it as deleted.
      return PatientRecord.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $set: { deletedAt: now, deletedBy } },
        { session, new: false }
      );
    });
  } finally {
    await session.endSession();
  }
};
