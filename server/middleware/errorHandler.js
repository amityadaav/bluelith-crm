import AppError from "../utils/AppError.js";

// ─── 404 — route not found ────────────────────────────────────────────────────
export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message    = `Resource not found. Invalid ID: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message    = `Duplicate value for field: ${field}. Please use a different value.`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors (handled in protect, but just in case)
  if (err.name === "JsonWebTokenError") { statusCode = 401; message = "Invalid token."; }
  if (err.name === "TokenExpiredError") { statusCode = 401; message = "Token expired. Please login again."; }

  // Log non-operational (programming) errors in full
  if (!err.isOperational) {
    console.error("🔥 UNHANDLED ERROR:", err);
  }

  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};
