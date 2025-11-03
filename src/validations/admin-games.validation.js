import { body, param, query } from 'express-validator';

export const validarCrearJuego = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del juego es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
];

export const validarActualizarJuego = [
  param('id').isString().withMessage('ID de juego inválido'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('estado').optional().isIn(['Activo', 'Inactivo']).withMessage('El estado debe ser "Activo" o "Inactivo"'),
];

export const validarCrearSorteo = [
  body('modalidad_id').isString().withMessage('ID de modalidad inválido'),
  body('fecha')
    .isDate()
    .withMessage('Fecha inválida. Use formato YYYY-MM-DD')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fecha < hoy) {
        throw new Error('La fecha no puede ser anterior a hoy');
      }
      return true;
    }),
  body('hora')
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage('Hora inválida. Use formato HH:MM:SS'),
];

export const validarActualizarSorteo = [
  param('id').isString().withMessage('ID de sorteo inválido'),
  body('estado')
    .optional()
    .isIn(['Pendiente', 'Abierto', 'Cerrado', 'Finalizado', 'Cancelado'])
    .withMessage('Estado de sorteo inválido'),
  body('numero_ganador')
    .optional()
    .custom((value) => {
      if (value === null) return true;
      const num = parseInt(value);
      if (isNaN(num) || num < 0 || num > 99) {
        throw new Error('El número ganador debe estar entre 00 y 99');
      }
      return true;
    }),
];

export const validarListarSorteos = [
  query('estado')
    .optional()
    .isIn(['Pendiente', 'Abierto', 'Cerrado', 'Finalizado', 'Cancelado'])
    .withMessage('Estado de sorteo inválido'),
  query('fecha_desde').optional().isISO8601().withMessage('Fecha desde inválida'),
  query('fecha_hasta').optional().isISO8601().withMessage('Fecha hasta inválida'),
  query('modalidad').optional().isString().withMessage('ID de modalidad inválido'),
  query('limite').optional().isInt({ min: 1, max: 200 }).withMessage('El límite debe ser entre 1 y 200'),
  query('pagina').optional().isInt({ min: 1 }).withMessage('La página debe ser mayor a 0'),
];

export const validarIdParam = [param('id').isString().withMessage('ID inválido')];
