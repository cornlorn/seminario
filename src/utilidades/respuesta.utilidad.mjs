/**
 * Crea una respuesta de éxito estándar
 * 
 * @param {string} mensaje - Mensaje de éxito
 * @param {object} datos - Datos adicionales para incluir en la respuesta
 * @param {number} statusCode - Código de estado HTTP (por defecto 200)
 * @returns {object} Objeto de respuesta
 */
export const respuestaExito = (mensaje, datos = {}, statusCode = 200) => {
  return {
    statusCode,
    body: { mensaje, ...datos }
  };
};

/**
 * Crea una respuesta de error estándar
 * 
 * @param {string} mensaje - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP (por defecto 400)
 * @returns {object} Objeto de respuesta
 */
export const respuestaError = (mensaje, statusCode = 400) => {
  return {
    statusCode,
    body: { mensaje }
  };
};

/**
 * Formatea un número como moneda
 * 
 * @param {number} monto - Monto a formatear
 * @param {number} decimales - Número de decimales (por defecto 2)
 * @returns {string} Monto formateado
 */
export const formatearMoneda = (monto, decimales = 2) => {
  return parseFloat(monto).toFixed(decimales);
};

/**
 * Valida que un monto sea válido
 * 
 * @param {any} monto - Monto a validar
 * @returns {object} { valido: boolean, montoFloat?: number, error?: string }
 */
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
