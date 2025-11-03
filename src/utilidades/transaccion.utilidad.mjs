import { formatearMoneda, validarMonto } from './respuesta.utilidad.mjs';

/**
 * Valida un monto con límites específicos
 *
 * @param {any} monto - Monto a validar
 * @param {object} limites - Objeto con min y max opcionales
 * @returns {object} { valido: boolean, montoFloat?: number, error?: string }
 */
export const validarMontoConLimites = (monto, limites = {}) => {
  const { min, max } = limites;

  const resultado = validarMonto(monto);
  if (!resultado.valido) {
    return resultado;
  }

  const montoFloat = resultado.montoFloat;

  if (min !== undefined && montoFloat < min) {
    return { valido: false, error: `El monto mínimo es L${formatearMoneda(min)}` };
  }

  if (max !== undefined && montoFloat > max) {
    return { valido: false, error: `El monto máximo es L${formatearMoneda(max)}` };
  }

  return { valido: true, montoFloat };
};

/**
 * Crea una notificación estándar
 *
 * @param {object} datos - Datos de la notificación
 * @returns {object} Objeto para crear notificación
 */
export const crearDatosNotificacion = (datos) => {
  const { usuario, tipo = 'Sistema', asunto, mensaje, referencia, metadata = {} } = datos;

  return {
    id: crypto.randomUUID(),
    usuario,
    tipo,
    asunto,
    mensaje,
    leida: false,
    enviada: false,
    referencia,
    metadata,
  };
};

/**
 * Crea datos estándar para una transacción
 *
 * @param {object} datos - Datos de la transacción
 * @returns {object} Objeto para crear transacción
 */
export const crearDatosTransaccion = (datos) => {
  const { usuario, tipo, concepto, monto, saldoAnterior, saldoNuevo, vendedor, metadata = {} } = datos;

  return {
    id: crypto.randomUUID(),
    usuario,
    tipo,
    concepto,
    monto,
    saldo_anterior: saldoAnterior,
    saldo_nuevo: saldoNuevo,
    vendedor,
    metadata,
  };
};
