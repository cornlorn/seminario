export const errorHandler = (error, request, response, next) => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);

  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Error interno del servidor';

  response
    .status(statusCode)
    .json({ error: true, mensaje: message, ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) });
};

export const notFoundHandler = (request, response) => {
  response.status(404).json({ error: true, mensaje: `Ruta no encontrada: ${request.method} ${request.url}` });
};

export const asyncHandler = (fn) => (request, response, next) => {
  Promise.resolve(fn(request, response, next)).catch(next);
};
