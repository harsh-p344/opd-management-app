import Medicine from '../models/Medicine.js';

const normalize = (value, fallback) => {
  const parsed = Number(value ?? fallback);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getStockStatus = (medicine) => {
  const stock = Number(medicine.totalStock || 0);
  const reorderLevel = Number(medicine.reorderLevel || 0);

  if (stock <= 0) return 'out';
  if (stock <= reorderLevel) return 'low';
  return 'ok';
};

const getExpiryStatus = (medicine) => {
  const batches = Array.isArray(medicine.batches) ? medicine.batches : [];

  if (!batches.length) return 'valid';

  const states = batches.map((batch) => {
    const days = getDaysUntilExpiry(batch.expiryDate);
    if (Number.isFinite(days) && days < 0) return 'expired';
    if (Number.isFinite(days) && days <= 30) return 'near';
    return 'valid';
  });

  if (states.includes('expired')) return 'expired';
  if (states.includes('near')) return 'near';
  return 'valid';
};

const parseNumber = (value, field, allowZero = true) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (!allowZero && parsed === 0) || parsed < 0) {
    const error = new Error(`${field} must be a valid non-negative number`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const validateBatch = (batch) => {
  if (!batch || !batch.batchNumber || !batch.purchaseDate || !batch.supplierName || !batch.expiryDate) {
    const error = new Error('Each batch requires batchNumber, purchaseDate, supplierName and expiryDate');
    error.statusCode = 400;
    throw error;
  }

  parseNumber(batch.quantity, 'Batch quantity');
  parseNumber(batch.purchasePrice, 'Batch purchasePrice');
  parseNumber(batch.sellingPrice, 'Batch sellingPrice');
};

const buildQuery = ({ search, category, stockStatus, expiryStatus }) => {
  const query = {};

  if (search) {
    const term = search.trim();
    if (term) {
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { genericName: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { 'batches.batchNumber': { $regex: term, $options: 'i' } },
      ];
    }
  }

  if (category) {
    query.category = { $regex: category.trim(), $options: 'i' };
  }

  if (stockStatus) {
    const status = stockStatus.toLowerCase();
    if (status === 'low') {
      query.$expr = { $lte: ['$totalStock', '$reorderLevel'] };
    } else if (status === 'out') {
      query.totalStock = 0;
    } else if (status === 'ok') {
      query.$expr = { $gt: ['$totalStock', '$reorderLevel'] };
    }
  }

  if (expiryStatus) {
    const status = String(expiryStatus).trim().toLowerCase();

    if (status === 'expired') {
      query['batches.expiryDate'] = { $lt: new Date() };
    } else if (status === 'near') {
      const today = new Date();
      const withinThirtyDays = new Date();
      withinThirtyDays.setDate(today.getDate() + 30);
      query['batches.expiryDate'] = { $gte: today, $lte: withinThirtyDays };
    } else if (status === 'valid') {
      const today = new Date();
      const afterThirtyDays = new Date();
      afterThirtyDays.setDate(today.getDate() + 30);
      query['batches.expiryDate'] = { $gt: afterThirtyDays };
    }
  }

  return query;
};

export const listMedicines = async (filters = {}) => {
  const page = normalize(filters.page, 1);
  const limit = normalize(filters.limit, 10);
  const skip = (page - 1) * limit;

  const query = buildQuery(filters);
  const total = await Medicine.countDocuments(query);

  const items = await Medicine.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const medicines = items.map((medicine) => ({
    ...medicine,
    stockStatus: getStockStatus(medicine),
    expiryStatus: getExpiryStatus(medicine),
  }));

  return {
    medicines,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const getMedicineById = async (id) => {
  const medicine = await Medicine.findById(id).lean();
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    ...medicine,
    stockStatus: getStockStatus(medicine),
    expiryStatus: getExpiryStatus(medicine),
  };
};

export const createMedicine = async (payload = {}) => {
  const name = String(payload.name || '').trim();
  const unit = String(payload.unit || '').trim();
  const reorderLevel = parseNumber(payload.reorderLevel ?? 0, 'reorderLevel');

  if (!name || !unit) {
    const error = new Error('Medicine name and unit are required');
    error.statusCode = 400;
    throw error;
  }

  const batches = Array.isArray(payload.batches) ? payload.batches : [];
  batches.forEach(validateBatch);

  return Medicine.create({
    name,
    genericName: String(payload.genericName || '').trim(),
    category: String(payload.category || '').trim(),
    unit,
    reorderLevel,
    batches,
  });
};

export const updateMedicine = async (id, payload = {}) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }

  if (payload.name !== undefined) medicine.name = String(payload.name).trim();
  if (payload.genericName !== undefined) medicine.genericName = String(payload.genericName).trim();
  if (payload.category !== undefined) medicine.category = String(payload.category).trim();
  if (payload.unit !== undefined) medicine.unit = String(payload.unit).trim();
  if (payload.reorderLevel !== undefined) medicine.reorderLevel = parseNumber(payload.reorderLevel, 'reorderLevel');
  if (payload.batches !== undefined) {
    medicine.batches = Array.isArray(payload.batches) ? payload.batches : [];
    medicine.batches.forEach(validateBatch);
  }

  if (!medicine.name || !medicine.unit) {
    const error = new Error('Medicine name and unit are required');
    error.statusCode = 400;
    throw error;
  }

  await medicine.save();
  return medicine;
};

export const deleteMedicine = async (id) => {
  const medicine = await Medicine.findByIdAndDelete(id);
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }

  return medicine;
};
