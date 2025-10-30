import { body } from 'express-validator';

export const validarRestablecer = [
  body('codigo')
    .notEmpty()
    .withMessage('El código de recuperación es obligatorio')
    .isLength({ min: 6, max: 6 })
    .withMessage('El código de recuperación debe tener 6 caracteres'),

  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número'),
];
