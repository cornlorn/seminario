/**
 * Envuelve una función de controlador con manejo de errores estándar
 * Reduce código repetitivo try-catch en los controladores
 *
 * @param {Function} controlador - Función async del controlador
 * @returns {Function} Controlador envuelto con manejo de errores
 */
export const manejarErrores = (controlador) => {
  return async (request, response, next) => {
    try {
      await controlador(request, response, next);
    } catch (error) {
      console.error('Error en el controlador:');
      console.error(error);

      // No enviar respuesta si ya se envió una
      if (!response.headersSent) {
        response.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    }
  };
};

/**
 * Envuelve una operación con transacción de base de datos
 * Maneja automáticamente commit y rollback
 *
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize
 * @param {Function} operacion - Función async que recibe la transacción
 * @returns {Promise<any>} Resultado de la operación
 */
export const conTransaccion = async (sequelize, operacion) => {
  const transaction = await sequelize.transaction();

  try {
    const resultado = await operacion(transaction);
    await transaction.commit();
    return resultado;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
