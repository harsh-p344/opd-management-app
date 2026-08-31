import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { sendSuccess } from '../utils/response.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

router.get('/me', requireAuth, (req, res) => {
  sendSuccess(res, 200, 'User details retrieved', {
    user: req.user,
  });
});

router.get('/admin-check', requireAuth, requireRole('admin'), (req, res) => {
  sendSuccess(res, 200, 'Admin access granted', {
    user: req.user,
  });
});

router.get('/nurse-check', requireAuth, requireRole('nurse'), (req, res) => {
  sendSuccess(res, 200, 'Nurse access granted', {
    user: req.user,
  });
});

export default router;
