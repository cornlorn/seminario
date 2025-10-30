import { body } from 'express-validator';

export const validarIngreso = [
  body('correo')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
];
