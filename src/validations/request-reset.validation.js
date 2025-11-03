import { body } from 'express-validator';

export const validarSolicitud = [
  body('correo').isEmail().withMessage('El correo debe tener un formato válido').normalizeEmail(),
];
