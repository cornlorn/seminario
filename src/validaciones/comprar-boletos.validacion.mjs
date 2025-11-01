import { body } from 'express-validator';

export const validarCompraBoletos = [
  body('sorteo_id')
    .notEmpty()
    .withMessage('El ID del sorteo es obligatorio')
    .isUUID()
    .withMessage('El ID del sorteo debe ser un UUID válido'),

  body('boletos')
    .notEmpty()
    .withMessage('Los boletos son obligatorios')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un boleto'),

  body('boletos.*.numero')
    .notEmpty()
    .withMessage('El número es obligatorio')
    .isInt({ min: 0, max: 99 })
    .withMessage('El número debe estar entre 0 y 99'),

  body('boletos.*.monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isFloat({ min: 5 })
    .withMessage('El monto mínimo es L5')
    .custom((value) => {
      if (value % 5 !== 0) {
        throw new Error('El monto debe ser múltiplo de 5');
      }
      return true;
    }),
];
