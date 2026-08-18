import express from 'express';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'opd-management-api',
    timestamp: new Date().toISOString(),
  });
});

export default router;
