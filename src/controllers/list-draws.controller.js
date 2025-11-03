import { Op } from 'sequelize';
import { Juego, Modalidad, Sorteo } from '../models/index.js';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const listarSorteosDisponibles = async (request, response) => {
  try {
    const ahora = new Date();

    const sorteos = await Sorteo.findAll({
      where: { estado: 'Abierto', fecha_cierre_compras: { [Op.gt]: ahora } },
      include: [
        {
          model: Modalidad,
          as: 'modalidadDetalles',
          include: [{ model: Juego, as: 'juegoDetalles', where: { estado: 'Activo' } }],
          where: { estado: 'Activo' },
        },
      ],
      order: [['fecha_sorteo', 'ASC']],
      limit: 10,
    });

    const sorteosFormateados = sorteos.map((sorteo) => ({
      id: sorteo.id,
      fecha: sorteo.fecha,
      hora: sorteo.hora,
      fecha_sorteo: sorteo.fecha_sorteo,
      fecha_cierre_compras: sorteo.fecha_cierre_compras,
      tiempo_restante_minutos: Math.floor((new Date(sorteo.fecha_cierre_compras) - ahora) / 1000 / 60),
      juego: {
        nombre: sorteo.modalidadDetalles.juegoDetalles.nombre,
        descripcion: sorteo.modalidadDetalles.juegoDetalles.descripcion,
      },
      modalidad: {
        nombre: sorteo.modalidadDetalles.nombre,
        precio_minimo: parseFloat(sorteo.modalidadDetalles.precio_minimo),
        multiplo_apuesta: parseFloat(sorteo.modalidadDetalles.multiplo_apuesta),
        multiplicador_premio: sorteo.modalidadDetalles.multiplicador_premio,
        rango_min: sorteo.modalidadDetalles.rango_numero_min,
        rango_max: sorteo.modalidadDetalles.rango_numero_max,
      },
      estadisticas: { total_boletos: sorteo.total_boletos, total_apostado: parseFloat(sorteo.total_apostado) },
    }));

    response
      .status(200)
      .json({
        mensaje: 'Sorteos disponibles obtenidos exitosamente',
        cantidad: sorteosFormateados.length,
        sorteos: sorteosFormateados,
      });
  } catch (error) {
    console.error('Error al listar sorteos disponibles:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const obtenerSorteo = async (request, response) => {
  try {
    const { id } = request.params;

    const sorteo = await Sorteo.findByPk(id, {
      include: [{ model: Modalidad, as: 'modalidadDetalles', include: [{ model: Juego, as: 'juegoDetalles' }] }],
    });

    if (!sorteo) {
      return response.status(404).json({ mensaje: 'Sorteo no encontrado' });
    }

    const ahora = new Date();
    const tiempoRestante =
      sorteo.estado === 'Abierto' ? Math.floor((new Date(sorteo.fecha_cierre_compras) - ahora) / 1000 / 60) : 0;

    const sorteoFormateado = {
      id: sorteo.id,
      fecha: sorteo.fecha,
      hora: sorteo.hora,
      fecha_sorteo: sorteo.fecha_sorteo,
      fecha_cierre_compras: sorteo.fecha_cierre_compras,
      estado: sorteo.estado,
      numero_ganador: sorteo.numero_ganador,
      tiempo_restante_minutos: tiempoRestante,
      juego: {
        nombre: sorteo.modalidadDetalles.juegoDetalles.nombre,
        descripcion: sorteo.modalidadDetalles.juegoDetalles.descripcion,
      },
      modalidad: {
        nombre: sorteo.modalidadDetalles.nombre,
        precio_minimo: parseFloat(sorteo.modalidadDetalles.precio_minimo),
        multiplo_apuesta: parseFloat(sorteo.modalidadDetalles.multiplo_apuesta),
        multiplicador_premio: sorteo.modalidadDetalles.multiplicador_premio,
        rango_min: sorteo.modalidadDetalles.rango_numero_min,
        rango_max: sorteo.modalidadDetalles.rango_numero_max,
      },
      estadisticas: {
        total_boletos: sorteo.total_boletos,
        total_apostado: parseFloat(sorteo.total_apostado),
        total_premios: sorteo.total_premios ? parseFloat(sorteo.total_premios) : null,
      },
    };

    response.status(200).json({ mensaje: 'Sorteo obtenido exitosamente', sorteo: sorteoFormateado });
  } catch (error) {
    console.error('Error al obtener sorteo:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
