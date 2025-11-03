/**
 * Admin games and draws management controller
 * Handles CRUD operations for games, modalities, and draws
 */

import { randomUUID } from 'crypto';
import { Op } from 'sequelize';
import { Juego, Modalidad, Sorteo, Boleto } from '../models/index.js';
import { sequelize } from '../config/database.config.js';

/**
 * List all games
 * @route GET /admin/juegos
 */
export const listarJuegos = async (request, response) => {
  try {
    const { estado } = request.query;
    const where = {};
    if (estado) where.estado = estado;

    const juegos = await Juego.findAll({
      where,
      include: [{ model: Modalidad, as: 'modalidades' }],
      order: [['creado', 'DESC']],
    });

    return response.status(200).json({ mensaje: 'Juegos obtenidos exitosamente', juegos });
  } catch (error) {
    console.error('Error al listar juegos:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Create a new game
 * @route POST /admin/juegos
 */
export const crearJuego = async (request, response) => {
  try {
    const { nombre, descripcion } = request.body;

    // Check if game already exists
    const juegoExistente = await Juego.findOne({ where: { nombre } });
    if (juegoExistente) {
      return response.status(409).json({ error: 'Ya existe un juego con ese nombre' });
    }

    const juego = await Juego.create({ id: randomUUID(), nombre, descripcion, estado: 'Activo' });

    return response.status(201).json({ mensaje: 'Juego creado exitosamente', juego });
  } catch (error) {
    console.error('Error al crear juego:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Update a game
 * @route PUT /admin/juegos/:id
 */
export const actualizarJuego = async (request, response) => {
  try {
    const { id } = request.params;
    const { nombre, descripcion, estado } = request.body;

    const juego = await Juego.findByPk(id);
    if (!juego) {
      return response.status(404).json({ error: 'Juego no encontrado' });
    }

    if (nombre && nombre !== juego.nombre) {
      const existente = await Juego.findOne({ where: { nombre, id: { [Op.ne]: id } } });
      if (existente) {
        return response.status(409).json({ error: 'Ya existe un juego con ese nombre' });
      }
      juego.nombre = nombre;
    }

    if (descripcion !== undefined) juego.descripcion = descripcion;
    if (estado) juego.estado = estado;

    await juego.save();

    return response.status(200).json({ mensaje: 'Juego actualizado exitosamente', juego });
  } catch (error) {
    console.error('Error al actualizar juego:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * List all draws with filters
 * @route GET /admin/sorteos
 */
export const listarSorteos = async (request, response) => {
  try {
    const { estado, fecha_desde, fecha_hasta, modalidad, limite = 100, pagina = 1 } = request.query;

    const where = {};
    if (estado) where.estado = estado;
    if (modalidad) where.modalidad = modalidad;
    if (fecha_desde || fecha_hasta) {
      where.fecha_sorteo = {};
      if (fecha_desde) where.fecha_sorteo[Op.gte] = new Date(fecha_desde);
      if (fecha_hasta) where.fecha_sorteo[Op.lte] = new Date(fecha_hasta);
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows: sorteos } = await Sorteo.findAndCountAll({
      where,
      include: [{ model: Modalidad, as: 'modalidadData' }],
      limit: parseInt(limite),
      offset,
      order: [['fecha_sorteo', 'DESC']],
    });

    return response
      .status(200)
      .json({
        mensaje: 'Sorteos obtenidos exitosamente',
        sorteos,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(count / parseInt(limite)),
        },
      });
  } catch (error) {
    console.error('Error al listar sorteos:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Create a new draw
 * @route POST /admin/sorteos
 */
export const crearSorteo = async (request, response) => {
  try {
    const { modalidad_id, fecha, hora } = request.body;

    const modalidad = await Modalidad.findByPk(modalidad_id);
    if (!modalidad) {
      return response.status(404).json({ error: 'Modalidad no encontrada' });
    }

    // Check if draw already exists
    const sorteoExistente = await Sorteo.findOne({ where: { modalidad: modalidad_id, fecha, hora } });

    if (sorteoExistente) {
      return response.status(409).json({ error: 'Ya existe un sorteo para esta modalidad, fecha y hora' });
    }

    // Build fecha_sorteo and fecha_cierre_compras
    const [horas, minutos] = hora.split(':');
    const fechaSorteo = new Date(`${fecha}T${hora}`);
    const fechaCierre = new Date(fechaSorteo);
    fechaCierre.setMinutes(fechaCierre.getMinutes() - 15);

    // Determine estado based on current time
    const ahora = new Date();
    let estado = 'Pendiente';
    if (ahora >= fechaCierre && ahora < fechaSorteo) {
      estado = 'Cerrado';
    } else if (ahora < fechaCierre) {
      estado = 'Abierto';
    }

    const sorteo = await Sorteo.create({
      id: randomUUID(),
      modalidad: modalidad_id,
      fecha,
      hora,
      fecha_sorteo: fechaSorteo,
      fecha_cierre_compras: fechaCierre,
      estado,
    });

    return response.status(201).json({ mensaje: 'Sorteo creado exitosamente', sorteo });
  } catch (error) {
    console.error('Error al crear sorteo:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Update a draw
 * @route PUT /admin/sorteos/:id
 */
export const actualizarSorteo = async (request, response) => {
  try {
    const { id } = request.params;
    const { estado, numero_ganador } = request.body;

    const sorteo = await Sorteo.findByPk(id);
    if (!sorteo) {
      return response.status(404).json({ error: 'Sorteo no encontrado' });
    }

    // Validate estado transitions
    if (estado) {
      if (estado === 'Finalizado' && sorteo.estado === 'Finalizado') {
        return response.status(400).json({ error: 'El sorteo ya está finalizado' });
      }
      if (estado === 'Cancelado' && sorteo.estado === 'Finalizado') {
        return response.status(400).json({ error: 'No se puede cancelar un sorteo finalizado' });
      }
      sorteo.estado = estado;
    }

    if (numero_ganador !== undefined) {
      sorteo.numero_ganador = numero_ganador;
    }

    await sorteo.save();

    return response.status(200).json({ mensaje: 'Sorteo actualizado exitosamente', sorteo });
  } catch (error) {
    console.error('Error al actualizar sorteo:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Cancel/Delete a draw (only if no tickets sold)
 * @route DELETE /admin/sorteos/:id
 */
export const eliminarSorteo = async (request, response) => {
  try {
    const { id } = request.params;

    const sorteo = await Sorteo.findByPk(id);
    if (!sorteo) {
      return response.status(404).json({ error: 'Sorteo no encontrado' });
    }

    // Check if there are tickets sold
    const boletosVendidos = await Boleto.count({ where: { sorteo: id } });
    if (boletosVendidos > 0) {
      return response
        .status(400)
        .json({ error: 'No se puede eliminar un sorteo con boletos vendidos. Considere cancelarlo en su lugar.' });
    }

    await sorteo.destroy();

    return response.status(200).json({ mensaje: 'Sorteo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar sorteo:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Get draw statistics
 * @route GET /admin/sorteos/:id/estadisticas
 */
export const obtenerEstadisticasSorteo = async (request, response) => {
  try {
    const { id } = request.params;

    const sorteo = await Sorteo.findByPk(id, { include: [{ model: Modalidad, as: 'modalidadData' }] });

    if (!sorteo) {
      return response.status(404).json({ error: 'Sorteo no encontrado' });
    }

    const boletos = await Boleto.findAll({ where: { sorteo: id }, attributes: ['numero', 'monto', 'estado'] });

    const estadisticas = {
      total_boletos: boletos.length,
      total_apostado: sorteo.total_apostado,
      total_premios: sorteo.total_premios || 0,
      boletos_ganadores: boletos.filter((b) => b.estado === 'Ganador').length,
      distribución_numeros: {},
    };

    // Count bets per number
    boletos.forEach((boleto) => {
      const num = boleto.numero.toString().padStart(2, '0');
      if (!estadisticas.distribución_numeros[num]) {
        estadisticas.distribución_numeros[num] = { cantidad: 0, total_apostado: 0 };
      }
      estadisticas.distribución_numeros[num].cantidad++;
      estadisticas.distribución_numeros[num].total_apostado += parseFloat(boleto.monto);
    });

    return response
      .status(200)
      .json({
        mensaje: 'Estadísticas del sorteo obtenidas exitosamente',
        sorteo: {
          id: sorteo.id,
          fecha: sorteo.fecha,
          hora: sorteo.hora,
          estado: sorteo.estado,
          numero_ganador: sorteo.numero_ganador,
          modalidad: sorteo.modalidadData?.nombre,
        },
        estadisticas,
      });
  } catch (error) {
    console.error('Error al obtener estadísticas del sorteo:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};
