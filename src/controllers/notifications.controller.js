import { Notificacion } from '../models/index.js';

export const obtenerNotificaciones = async (request, response) => {
  try {
    const { id: usuarioId } = request.usuario;
    const { tipo, leida, limite = 50, pagina = 1 } = request.query;

    const where = { usuario: usuarioId };

    if (tipo) where.tipo = tipo;
    if (leida !== undefined) where.leida = leida === 'true';

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows: notificaciones } = await Notificacion.findAndCountAll({
      where,
      limit: parseInt(limite),
      offset,
      order: [['creado', 'DESC']],
    });

    const noLeidas = await Notificacion.count({ where: { usuario: usuarioId, leida: false } });

    return response
      .status(200)
      .json({
        mensaje: 'Notificaciones obtenidas exitosamente',
        notificaciones,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(count / parseInt(limite)),
        },
        no_leidas: noLeidas,
      });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const marcarComoLeida = async (request, response) => {
  try {
    const { id: usuarioId } = request.usuario;
    const { id } = request.params;

    const notificacion = await Notificacion.findOne({ where: { id, usuario: usuarioId } });

    if (!notificacion) {
      return response.status(404).json({ error: 'Notificación no encontrada' });
    }

    if (notificacion.leida) {
      return response.status(200).json({ mensaje: 'La notificación ya estaba marcada como leída' });
    }

    notificacion.leida = true;
    await notificacion.save();

    return response.status(200).json({ mensaje: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const marcarTodasComoLeidas = async (request, response) => {
  try {
    const { id: usuarioId } = request.usuario;

    const [updated] = await Notificacion.update({ leida: true }, { where: { usuario: usuarioId, leida: false } });

    const palabra = updated > 1 ? 'notificaciones' : 'notificación';
    const pluralMarcada = updated > 1 ? 's' : '';
    const pluralLeida = updated > 1 ? 's' : '';

    return response
      .status(200)
      .json({
        mensaje: `${updated} ${palabra} marcada${pluralMarcada} como leída${pluralLeida}`,
        actualizadas: updated,
      });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarNotificacion = async (request, response) => {
  try {
    const { id: usuarioId } = request.usuario;
    const { id } = request.params;

    const notificacion = await Notificacion.findOne({ where: { id, usuario: usuarioId } });

    if (!notificacion) {
      return response.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.destroy();

    return response.status(200).json({ mensaje: 'Notificación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar notificación:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};
