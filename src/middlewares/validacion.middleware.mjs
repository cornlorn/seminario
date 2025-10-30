import { validationResult } from 'express-validator';

export const validar = (request, response, next) => {
  const errores = validationResult(request);

  if (!errores.isEmpty()) {
    return response
      .status(400)
      .json({ errores: errores.array().map((err) => ({ campo: err.path, mensaje: err.msg })) });
  }

  next();
};
