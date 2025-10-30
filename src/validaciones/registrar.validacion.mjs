import { body } from 'express-validator';

export const validarRegistro = [
  body('correo').isEmail().withMessage('El correo debe tener un formato válido').normalizeEmail(),

  body('contrasena')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número'),

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre no debe superar 50 caracteres'),

  body('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El apellido no debe superar 50 caracteres'),

  body('telefono')
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .matches(/^[0-9+\- ]{8,15}$/)
    .withMessage('El teléfono debe ser válido'),

  body('nacimiento')
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD'),
];
