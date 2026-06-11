import logger from "../utils/logger.js";
import { AppError } from "../utils/appError.js";

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error
  logger.error(`${err.message}`, {
    statusCode: err.statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
  });

  // Handle specific MongoDB/Mongoose errors
  let error = { ...err };
  error.message = err.message;

  // 1. Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = `Invalid format for field ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // 2. Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error.message = `Duplicate field value: '${value}' for field '${field}'. Please use another value.`;
    error.statusCode = 409;
  }

  // 3. Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((el) => el.message);
    error.message = `Validation failed: ${messages.join(", ")}`;
    error.statusCode = 400;
  }

  // 4. JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token. Please log in again.";
    error.statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    error.message = "Your token has expired. Please log in again.";
    error.statusCode = 401;
  }

  // Send response
  const response = {
    message: error.message || "An unexpected error occurred on the server",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(error.statusCode || 500).json(response);
};

// Middleware for handling 404 (Route not found)
export const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(err);
};
