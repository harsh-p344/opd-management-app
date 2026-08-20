import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const router = express.Router();

router.get('/health', asyncHandler(async (_req, res) => {
  sendSuccess(res, 200, 'API is healthy', {
    status: 'ok',
    service: 'opd-management-api',
    timestamp: new Date().toISOString(),
  });
}));

export default router;
