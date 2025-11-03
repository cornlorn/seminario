import { body, param, query } from 'express-validator';

export const validarActualizarUsuario = [
  param('id').isString().withMessage('ID de usuario inválido'),
  body('estado').isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser "Activo" o "Inactivo"'),
];

export const validarIdUsuario = [param('id').isString().withMessage('ID de usuario inválido')];

export const validarListarUsuarios = [
  query('rol').optional().isIn(['Administrador', 'Vendedor', 'Jugador']).withMessage('Rol inválido'),
  query('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('Estado inválido'),
  query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe ser entre 1 y 100'),
  query('pagina').optional().isInt({ min: 1 }).withMessage('La página debe ser mayor a 0'),
];
