export const respuestaExito = (mensaje, datos = {}, statusCode = 200) => {
  return { statusCode, body: { mensaje, ...datos } };
};

export const respuestaError = (mensaje, statusCode = 400) => {
  return { statusCode, body: { mensaje } };
};

export const formatearMoneda = (monto, decimales = 2) => {
  return parseFloat(monto).toFixed(decimales);
};

export const validarMonto = (monto) => {
  const montoFloat = parseFloat(monto);

  if (isNaN(montoFloat)) {
    return { valido: false, error: 'El monto debe ser un número válido' };
  }

  if (montoFloat <= 0) {
    return { valido: false, error: 'El monto debe ser mayor a cero' };
  }

  return { valido: true, montoFloat };
};
