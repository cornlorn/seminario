import { body } from 'express-validator';

export const validarCrearUsuario = [
  body('correo')
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('rol')
    .notEmpty()
    .withMessage('El rol es obligatorio')
    .isIn(['Administrador', 'Vendedor', 'Jugador'])
    .withMessage('El rol debe ser Administrador, Vendedor o Jugador'),

  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre no debe superar 50 caracteres'),

  body('apellido').optional().isLength({ max: 50 }).withMessage('El apellido no debe superar 50 caracteres'),

  body('telefono')
    .optional()
    .matches(/^[0-9+\- ]{8,20}$/)
    .withMessage('El teléfono debe ser válido'),

  body('direccion').optional().isLength({ max: 500 }).withMessage('La dirección no debe superar 500 caracteres'),

  body('comision').optional().isFloat({ min: 0, max: 100 }).withMessage('La comisión debe estar entre 0% y 100%'),

  body('saldo_inicial').optional().isFloat({ min: 0 }).withMessage('El saldo inicial no puede ser negativo'),

  body('nacimiento')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD'),
];
