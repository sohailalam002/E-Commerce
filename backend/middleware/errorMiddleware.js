// Handle 404 — route not found
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler — catches all errors thrown in controllers
export const errorHandler = (err, req, res, next) => {
  // If status is still 200 (default), set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Show stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
