import { body } from 'express-validator';

export const validarCambioContrasena = [
  body('contrasena_actual').notEmpty().withMessage('La contraseña actual es obligatoria'),

  body('contrasena_nueva')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La nueva contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/)
    .withMessage('La nueva contraseña debe contener al menos un número'),

  body('confirmar_contrasena')
    .notEmpty()
    .withMessage('La confirmación de contraseña es obligatoria')
    .custom((value, { req }) => {
      if (value !== req.body.contrasena_nueva) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
];
