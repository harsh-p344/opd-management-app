import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  createPatientRecord,
  deletePatientRecord,
  getPatientById,
  listPatients,
} from '../services/patientRecordService.js';

export const getPatients = asyncHandler(async (req, res) => {
  const result = await listPatients(req.query);
  sendSuccess(res, 200, 'Patients retrieved', result);
});

export const getPatient = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id, req.query);
  sendSuccess(res, 200, 'Patient retrieved', patient);
});

export const createPatientRecordHandler = asyncHandler(async (req, res) => {
  const result = await createPatientRecord(req.body || {}, req.user.id);
  sendSuccess(res, 201, 'Patient record created', result);
});

export const deletePatientRecordHandler = asyncHandler(async (req, res) => {
  const result = await deletePatientRecord(req.params.id, req.user.id);
  sendSuccess(res, 200, 'Patient record deleted and medicine stock restored', result);
});
