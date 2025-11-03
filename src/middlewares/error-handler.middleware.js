/**
 * Global error handler middleware
 * Centralized error handling for the application
 */

/**
 * Global error handler
 * @param {Error} error - The error object
 * @param {import("express").Request} request - Express request object
 * @param {import("express").Response} response - Express response object
 * @param {import("express").NextFunction} next - Express next function
 */
export const errorHandler = (error, request, response, next) => {
  // Log error for debugging
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);

  // Default error status and message
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Error interno del servidor';

  // Send error response
  response.status(statusCode).json({
    error: true,
    mensaje: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * Not found handler
 * @param {import("express").Request} request - Express request object
 * @param {import("express").Response} response - Express response object
 */
export const notFoundHandler = (request, response) => {
  response.status(404).json({
    error: true,
    mensaje: `Ruta no encontrada: ${request.method} ${request.url}`,
  });
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors automatically
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => (request, response, next) => {
  Promise.resolve(fn(request, response, next)).catch(next);
};
