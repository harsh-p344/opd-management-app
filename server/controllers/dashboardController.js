import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import Patient from '../models/Patient.js';
import Medicine from '../models/Medicine.js';
import { calculateDashboardStats } from '../services/dashboardService.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [patients, medicines] = await Promise.all([
    Patient.find({}).lean(),
    Medicine.find({}).lean(),
  ]);

  const stats = calculateDashboardStats({ patients, medicines });

  sendSuccess(res, 200, 'Dashboard statistics retrieved', stats);
});
