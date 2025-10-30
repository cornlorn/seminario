import bcrypt from 'bcrypt';
import { sequelize } from '../../config/database.config.mjs';
import { Usuario, Jugador, Billetera } from '../../modelos/index.mjs';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const registrar = async (request, response) => {
  const { correo, contrasena } = request.body;
  const { nombre, apellido, telefono, nacimiento } = request.body;

  try {
    const usuarioExistente = await Usuario.findOne({ where: { correo } });

    if (usuarioExistente) {
      return response
        .status(409)
        .json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    await sequelize.transaction(async (transaccion) => {
      const usuarioUUID = crypto.randomUUID();
      const jugadorUUID = crypto.randomUUID();

      await Usuario.create(
        {
          id: usuarioUUID,
          correo: correo,
          contrasena: await bcrypt.hash(contrasena, 10),
          rol: 'Jugador',
        },
        { transaction: transaccion },
      );

      await Jugador.create(
        {
          id: jugadorUUID,
          usuario: usuarioUUID,
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          nacimiento: nacimiento,
        },
        { transaction: transaccion },
      );

      await Billetera.create(
        { id: crypto.randomUUID(), jugador: jugadorUUID, saldo: 0.0 },
        { transaction: transaccion },
      );
    });

    response.status(201).json({ mensaje: 'Jugador registrado exitosamente' });
  } catch (error) {
    console.error('Error: No se pudo registrar al jugador');
    console.error(error.message);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
