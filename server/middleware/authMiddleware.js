import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/response.js';

export const requireAuth = async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return sendError(res, 500, 'JWT_SECRET is not configured');
  }
  const token = req.cookies?.token;

  if (!token) {
    return sendError(res, 401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 401, 'User not found');
    }

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

export const requireRole = (allowedRole) => (req, res, next) => {
  if (!req.user || req.user.role !== allowedRole) {
    return sendError(res, 403, `${allowedRole} access required`);
  }

  return next();
};
