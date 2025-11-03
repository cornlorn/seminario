import crypto from 'crypto';
import { sequelize } from '../../config/database.config.mjs';
import { Juego, Modalidad } from '../../modelos/index.mjs';

export const inicializarJugaTres = async () => {
  try {
    await sequelize.transaction(async (transaccion) => {
      let juego = await Juego.findOne({ where: { nombre: 'Jugá Tres' }, transaction: transaccion });

      if (!juego) {
        juego = await Juego.create(
          {
            id: crypto.randomUUID(),
            nombre: 'Jugá Tres',
            descripcion:
              'Con Jugá Tres podés ganar mucho más hasta L3,000 por cada L5 en los tres sorteos diarios de las 11:00 a.m., 3:00 p.m. y 9:00 p.m.',
            estado: 'Activo',
          },
          { transaction: transaccion },
        );

        console.log('Juego Jugá Tres creado exitosamente');
      }

      // Modalidad: Ordená Tres
      let modalidadOrdenaTres = await Modalidad.findOne({
        where: { juego: juego.id, nombre: 'Ordená Tres' },
        transaction: transaccion,
      });

      if (!modalidadOrdenaTres) {
        modalidadOrdenaTres = await Modalidad.create(
          {
            id: crypto.randomUUID(),
            juego: juego.id,
            nombre: 'Ordená Tres',
            precio_minimo: 5.0,
            multiplo_apuesta: 5.0,
            multiplicador_premio: 600, // L3,000 / L5 = 600x
            rango_numero_min: 0,
            rango_numero_max: 999,
            estado: 'Activo',
          },
          { transaction: transaccion },
        );

        console.log('Modalidad Ordená Tres creada exitosamente');
      }

      // Modalidad: Mixeá Tres
      let modalidadMixeaTres = await Modalidad.findOne({
        where: { juego: juego.id, nombre: 'Mixeá Tres' },
        transaction: transaccion,
      });

      if (!modalidadMixeaTres) {
        modalidadMixeaTres = await Modalidad.create(
          {
            id: crypto.randomUUID(),
            juego: juego.id,
            nombre: 'Mixeá Tres',
            precio_minimo: 5.0,
            multiplo_apuesta: 5.0,
            multiplicador_premio: 100, // L500 / L5 = 100x (base), 200x para números con dígitos repetidos
            rango_numero_min: 0,
            rango_numero_max: 999,
            estado: 'Activo',
          },
          { transaction: transaccion },
        );

        console.log('Modalidad Mixeá Tres creada exitosamente');
      }
    });

    return true;
  } catch (error) {
    console.error('Error al inicializar el juego Jugá Tres:');
    console.error(error.message);
    return false;
  }
};
