import crypto from 'crypto';
import { sequelize } from '../../config/database.config.mjs';
import { Juego, Modalidad } from '../../modelos/index.mjs';

export const inicializarDiaria = async () => {
  try {
    await sequelize.transaction(async (transaccion) => {
      let juego = await Juego.findOne({ where: { nombre: 'Diaria' }, transaction: transaccion });

      if (!juego) {
        juego = await Juego.create(
          {
            id: crypto.randomUUID(),
            nombre: 'Diaria',
            descripcion: '¡Soñá y ganá todos los días con Diaria! Seleccioná tu número favorito del 00 al 99.',
            estado: 'Activo',
          },
          { transaction: transaccion },
        );

        console.log('Juego Diaria creado exitosamente');
      }

      let modalidad = await Modalidad.findOne({
        where: { juego: juego.id, nombre: 'Diaria Simple' },
        transaction: transaccion,
      });

      if (!modalidad) {
        modalidad = await Modalidad.create(
          {
            id: crypto.randomUUID(),
            juego: juego.id,
            nombre: 'Diaria Simple',
            precio_minimo: 5.0,
            multiplo_apuesta: 5.0,
            multiplicador_premio: 60,
            rango_numero_min: 0,
            rango_numero_max: 99,
            estado: 'Activo',
          },
          { transaction: transaccion },
        );

        console.log('Modalidad Diaria Simple creada exitosamente');
      }
    });

    return true;
  } catch (error) {
    console.error('Error al inicializar el juego Diaria:');
    console.error(error.message);
    return false;
  }
};
