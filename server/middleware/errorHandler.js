import { sendError } from '../utils/response.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  sendError(
    res,
    statusCode,
    err.message || 'Internal Server Error',
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack }
  );
};
