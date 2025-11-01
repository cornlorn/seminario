import { Op } from 'sequelize';
import { Modalidad, Sorteo } from '../modelos/index.mjs';

// Horarios de sorteos diarios (hora local Honduras GMT-6)
const HORARIOS_SORTEOS = ['11:00:00', '15:00:00', '21:00:00'];

/**
 * Crea sorteos automáticos para los próximos días
 * @param {number} diasAdelante - Cantidad de días hacia adelante para crear sorteos
 */
export const crearSorteosAutomaticos = async (diasAdelante = 7) => {
  try {
    // Obtener la modalidad Diaria Simple
    const modalidad = await Modalidad.findOne({ where: { nombre: 'Diaria Simple', estado: 'Activo' } });

    if (!modalidad) {
      console.error('No se encontró la modalidad Diaria Simple activa');
      return;
    }

    const fechaActual = new Date();
    const sorteosCreados = [];

    // Crear sorteos para los próximos días
    for (let dia = 0; dia < diasAdelante; dia++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() + dia);
      const fechaStr = fecha.toISOString().split('T')[0]; // YYYY-MM-DD

      for (const hora of HORARIOS_SORTEOS) {
        // Verificar si ya existe el sorteo
        const sorteoExistente = await Sorteo.findOne({
          where: { modalidad: modalidad.id, fecha: fechaStr, hora: hora },
        });

        if (!sorteoExistente) {
          // Crear fecha y hora completa del sorteo
          const [horas, minutos] = hora.split(':');
          const fechaSorteo = new Date(fecha);
          fechaSorteo.setHours(parseInt(horas), parseInt(minutos), 0, 0);

          // Fecha de cierre de compras (15 minutos antes)
          const fechaCierre = new Date(fechaSorteo);
          fechaCierre.setMinutes(fechaCierre.getMinutes() - 15);

          // Determinar estado inicial
          let estado = 'Pendiente';
          const ahora = new Date();

          if (ahora >= fechaSorteo) {
            estado = 'Finalizado'; // Ya pasó, no crear
            continue;
          } else if (ahora >= fechaCierre) {
            estado = 'Cerrado';
          } else if (ahora >= new Date(fechaSorteo.getTime() - 24 * 60 * 60 * 1000)) {
            estado = 'Abierto'; // 24 horas antes
          }

          // Crear sorteo
          const nuevoSorteo = await Sorteo.create({
            id: crypto.randomUUID(),
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

    if (sorteosCreados.length > 0) {
      console.log(`✓ ${sorteosCreados.length} sorteos automáticos creados`);
    }

    return sorteosCreados;
  } catch (error) {
    console.error('Error al crear sorteos automáticos:');
    console.error(error.message);
    return [];
  }
};

/**
 * Actualiza el estado de los sorteos según la fecha y hora actual
 */
export const actualizarEstadoSorteos = async () => {
  try {
    const ahora = new Date();

    // Abrir sorteos que están dentro de las 24 horas previas
    await Sorteo.update(
      { estado: 'Abierto' },
      {
        where: {
          estado: 'Pendiente',
          fecha_sorteo: { [Op.lte]: new Date(ahora.getTime() + 24 * 60 * 60 * 1000), [Op.gt]: ahora },
        },
      },
    );

    // Cerrar sorteos que llegaron a su hora de cierre
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

/**
 * Inicia el proceso de creación y actualización automática de sorteos
 */
export const iniciarSorteosAutomaticos = () => {
  // Crear sorteos al iniciar
  crearSorteosAutomaticos(7);

  // Actualizar estados cada minuto
  setInterval(actualizarEstadoSorteos, 60 * 1000);

  // Crear nuevos sorteos cada día a la medianoche
  setInterval(
    () => {
      crearSorteosAutomaticos(7);
    },
    24 * 60 * 60 * 1000,
  );

  console.log('✓ Sistema de sorteos automáticos iniciado');
};
