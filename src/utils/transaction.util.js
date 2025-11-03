import { randomUUID } from 'crypto';
import { formatearMoneda, validarMonto } from './response.util.js';

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

export const crearDatosNotificacion = (datos) => {
  const { usuario, tipo = 'Sistema', asunto, mensaje, referencia, metadata = {} } = datos;

  return { id: randomUUID(), usuario, tipo, asunto, mensaje, leida: false, enviada: false, referencia, metadata };
};

export const crearDatosTransaccion = (datos) => {
  const { usuario, tipo, concepto, monto, saldoAnterior, saldoNuevo, vendedor, metadata = {} } = datos;

  return {
    id: randomUUID(),
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
