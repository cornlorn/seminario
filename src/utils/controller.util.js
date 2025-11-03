export const manejarErrores = (controlador) => {
  return async (request, response, next) => {
    try {
      await controlador(request, response, next);
    } catch (error) {
      console.error('Error en el controlador:');
      console.error(error);

      if (!response.headersSent) {
        response.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    }
  };
};

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
