import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  addMedicine,
  editMedicine,
  getMedicine,
  getMedicines,
  removeMedicine,
} from '../controllers/medicineController.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getMedicines);
router.get('/:id', getMedicine);
router.post('/', addMedicine);
router.patch('/:id', editMedicine);
router.delete('/:id', removeMedicine);

export default router;
