import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  createMedicine,
  deleteMedicine,
  getMedicineById,
  listMedicines,
  updateMedicine,
} from '../services/medicineService.js';

export const getMedicines = asyncHandler(async (req, res) => {
  const result = await listMedicines(req.query);
  sendSuccess(res, 200, 'Medicines retrieved', result);
});

export const getMedicine = asyncHandler(async (req, res) => {
  const medicine = await getMedicineById(req.params.id);
  sendSuccess(res, 200, 'Medicine retrieved', medicine);
});

export const addMedicine = asyncHandler(async (req, res) => {
  const medicine = await createMedicine(req.body || {});
  sendSuccess(res, 201, 'Medicine created', medicine);
});

export const editMedicine = asyncHandler(async (req, res) => {
  const medicine = await updateMedicine(req.params.id, req.body || {});
  sendSuccess(res, 200, 'Medicine updated', medicine);
});

export const removeMedicine = asyncHandler(async (req, res) => {
  const medicine = await deleteMedicine(req.params.id);
  sendSuccess(res, 200, 'Medicine deleted', medicine);
});
