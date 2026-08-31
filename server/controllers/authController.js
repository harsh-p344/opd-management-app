import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { loginUser } from '../services/authService.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};

  const result = await loginUser({ username, password });

  res.cookie('token', result.token, cookieOptions);

  sendSuccess(res, 200, 'Login successful', {
    user: result.user,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendSuccess(res, 200, 'Logout successful');
});
