import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createPatientRecordHandler,
  deletePatientRecordHandler,
  getPatient,
  getPatients,
} from '../controllers/patientRecordController.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getPatients);
router.get('/:id', getPatient);
router.post('/', createPatientRecordHandler);
router.delete('/:id', deletePatientRecordHandler);

export default router;
