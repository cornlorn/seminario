import { body, query } from 'express-validator';

export const validarAgregarSaldo = [
  body('correo_jugador')
    .notEmpty()
    .withMessage('El correo del jugador es obligatorio')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isFloat({ min: 25, max: 1000 })
    .withMessage('El monto debe estar entre L25 y L1000'),
];

export const validarRetirarSaldo = [
  body('correo_jugador')
    .notEmpty()
    .withMessage('El correo del jugador es obligatorio')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),

  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage('El monto debe estar entre L0.01 y L10,000'),
];

export const validarBuscarJugador = [
  query('correo')
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('El correo debe tener un formato válido')
    .normalizeEmail(),
];
