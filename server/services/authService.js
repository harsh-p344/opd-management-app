import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET || 'clinic-opd-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const loginUser = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ username: username.trim().toLowerCase() });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    token,
  };
};
