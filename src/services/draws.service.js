import { randomUUID } from 'crypto';
import { Op } from 'sequelize';
import { Modalidad, Sorteo } from '../models/index.js';

const HORARIOS_SORTEOS = ['11:00:00', '15:00:00', '21:00:00'];

/**
 * @param {number} diasAdelante
 */
export const crearSorteosAutomaticos = async (diasAdelante = 7) => {
  try {
    // Obtener todas las modalidades activas para crear sorteos
    const modalidades = await Modalidad.findAll({
      where: { estado: 'Activo', nombre: { [Op.in]: ['Diaria Simple', 'Ordená Tres', 'Mixeá Tres'] } },
    });

    if (modalidades.length === 0) {
      console.error('No se encontraron modalidades activas para crear sorteos');
      return;
    }

    const fechaActual = new Date();
    const sorteosCreados = [];

    // Crear sorteos para cada modalidad activa
    for (const modalidad of modalidades) {
      for (let dia = 0; dia < diasAdelante; dia++) {
        const fecha = new Date(fechaActual);
        fecha.setDate(fecha.getDate() + dia);
        const fechaStr = fecha.toISOString().split('T')[0];

        for (const hora of HORARIOS_SORTEOS) {
          const sorteoExistente = await Sorteo.findOne({
            where: { modalidad: modalidad.id, fecha: fechaStr, hora: hora },
          });

          if (!sorteoExistente) {
            const [horas, minutos] = hora.split(':');
            const fechaSorteo = new Date(fecha);
            fechaSorteo.setHours(parseInt(horas), parseInt(minutos), 0, 0);

            const fechaCierre = new Date(fechaSorteo);
            fechaCierre.setMinutes(fechaCierre.getMinutes() - 15);

            let estado = 'Pendiente';
            const ahora = new Date();

            if (ahora >= fechaSorteo) {
              estado = 'Finalizado';
              continue;
            } else if (ahora >= fechaCierre) {
              estado = 'Cerrado';
            } else if (ahora >= new Date(fechaSorteo.getTime() - 24 * 60 * 60 * 1000)) {
              estado = 'Abierto';
            }

            const nuevoSorteo = await Sorteo.create({
              id: randomUUID(),
              modalidad: modalidad.id,
              fecha: fechaStr,
              hora: hora,
              fecha_sorteo: fechaSorteo,
              fecha_cierre_compras: fechaCierre,
              estado: estado,
              total_boletos: 0,
              total_apostado: 0.0,
              total_premios: null,
              numero_ganador: null,
            });

            sorteosCreados.push(nuevoSorteo);
          }
        }
      }
    }

    if (sorteosCreados.length > 0) {
      console.log(`${sorteosCreados.length} sorteos automáticos creados`);
    }

    return sorteosCreados;
  } catch (error) {
    console.error('Error al crear sorteos automáticos:');
    console.error(error.message);
    return [];
  }
};

export const actualizarEstadoSorteos = async () => {
  try {
    const ahora = new Date();

    await Sorteo.update(
      { estado: 'Abierto' },
      {
        where: {
          estado: 'Pendiente',
          fecha_sorteo: { [Op.lte]: new Date(ahora.getTime() + 24 * 60 * 60 * 1000), [Op.gt]: ahora },
        },
      },
    );

    await Sorteo.update(
      { estado: 'Cerrado' },
      { where: { estado: 'Abierto', fecha_cierre_compras: { [Op.lte]: ahora }, fecha_sorteo: { [Op.gt]: ahora } } },
    );

    return true;
  } catch (error) {
    console.error('Error al actualizar estado de sorteos:');
    console.error(error.message);
    return false;
  }
};

export const iniciarSorteosAutomaticos = () => {
  crearSorteosAutomaticos(7);

  setInterval(actualizarEstadoSorteos, 60 * 1000);

  setInterval(
    () => {
      crearSorteosAutomaticos(7);
    },
    24 * 60 * 60 * 1000,
  );

  console.log('Sistema de sorteos automáticos iniciado');
};
