import { Op } from 'sequelize';
import { Boleto, Jugador, Modalidad, Sorteo, Transaccion } from '../modelos/index.mjs';

/**
 * Obtiene el historial de boletos del usuario autenticado
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const misBoletos = async (request, response) => {
  try {
    const usuarioId = request.usuario.id;
    const { estado, limite = 50, pagina = 1 } = request.query;

    // Obtener jugador
    const jugador = await Jugador.findOne({ where: { usuario: usuarioId } });

    if (!jugador) {
      return response.status(404).json({ mensaje: 'Perfil de jugador no encontrado' });
    }

    // Construir filtros
    const where = { jugador: jugador.id };
    if (estado) {
      where.estado = estado;
    }

    // Calcular paginación
    const limiteInt = parseInt(limite);
    const paginaInt = parseInt(pagina);
    const offset = (paginaInt - 1) * limiteInt;

    // Obtener boletos
    const { count, rows: boletos } = await Boleto.findAndCountAll({
      where,
      include: [{ model: Sorteo, as: 'sorteoDetalles', include: [{ model: Modalidad, as: 'modalidadDetalles' }] }],
      order: [['creado', 'DESC']],
      limit: limiteInt,
      offset: offset,
    });

    const boletosFormateados = boletos.map((boleto) => ({
      id: boleto.id,
      numero_seleccionado: boleto.numero_seleccionado,
      monto_apostado: parseFloat(boleto.monto_apostado),
      monto_ganado: boleto.monto_ganado ? parseFloat(boleto.monto_ganado) : null,
      estado: boleto.estado,
      fecha_compra: boleto.fecha_compra,
      sorteo: {
        id: boleto.sorteoDetalles.id,
        fecha: boleto.sorteoDetalles.fecha,
        hora: boleto.sorteoDetalles.hora,
        estado: boleto.sorteoDetalles.estado,
        numero_ganador: boleto.sorteoDetalles.numero_ganador,
        modalidad: boleto.sorteoDetalles.modalidadDetalles.nombre,
      },
    }));

    response
      .status(200)
      .json({
        mensaje: 'Historial de boletos obtenido exitosamente',
        paginacion: { total: count, pagina: paginaInt, limite: limiteInt, total_paginas: Math.ceil(count / limiteInt) },
        boletos: boletosFormateados,
      });
  } catch (error) {
    console.error('Error al obtener historial de boletos:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Obtiene el historial de transacciones del usuario autenticado
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const misTransacciones = async (request, response) => {
  try {
    const usuarioId = request.usuario.id;
    const { tipo, limite = 50, pagina = 1 } = request.query;

    // Construir filtros
    const where = { usuario: usuarioId };
    if (tipo) {
      where.tipo = tipo;
    }

    // Calcular paginación
    const limiteInt = parseInt(limite);
    const paginaInt = parseInt(pagina);
    const offset = (paginaInt - 1) * limiteInt;

    // Obtener transacciones
    const { count, rows: transacciones } = await Transaccion.findAndCountAll({
      where,
      order: [['creado', 'DESC']],
      limit: limiteInt,
      offset: offset,
    });

    const transaccionesFormateadas = transacciones.map((t) => ({
      id: t.id,
      tipo: t.tipo,
      concepto: t.concepto,
      monto: parseFloat(t.monto),
      saldo_anterior: parseFloat(t.saldo_anterior),
      saldo_nuevo: parseFloat(t.saldo_nuevo),
      fecha: t.creado,
      referencia: t.referencia,
    }));

    response
      .status(200)
      .json({
        mensaje: 'Historial de transacciones obtenido exitosamente',
        paginacion: { total: count, pagina: paginaInt, limite: limiteInt, total_paginas: Math.ceil(count / limiteInt) },
        transacciones: transaccionesFormateadas,
      });
  } catch (error) {
    console.error('Error al obtener historial de transacciones:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Obtiene estadísticas generales del usuario
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const misEstadisticas = async (request, response) => {
  try {
    const usuarioId = request.usuario.id;

    // Obtener jugador
    const jugador = await Jugador.findOne({ where: { usuario: usuarioId } });

    if (!jugador) {
      return response.status(404).json({ mensaje: 'Perfil de jugador no encontrado' });
    }

    // Estadísticas de boletos
    const totalBoletos = await Boleto.count({ where: { jugador: jugador.id } });
    const boletosGanadores = await Boleto.count({ where: { jugador: jugador.id, estado: 'Ganador' } });
    const boletosPerdedores = await Boleto.count({ where: { jugador: jugador.id, estado: 'Perdedor' } });
    const boletosActivos = await Boleto.count({ where: { jugador: jugador.id, estado: 'Activo' } });

    // Montos apostados y ganados
    const boletos = await Boleto.findAll({
      where: { jugador: jugador.id },
      attributes: ['monto_apostado', 'monto_ganado', 'estado'],
    });

    let totalApostado = 0;
    let totalGanado = 0;

    for (const boleto of boletos) {
      totalApostado += parseFloat(boleto.monto_apostado);
      if (boleto.monto_ganado) {
        totalGanado += parseFloat(boleto.monto_ganado);
      }
    }

    // Último boleto ganador
    const ultimoBoletoGanador = await Boleto.findOne({
      where: { jugador: jugador.id, estado: 'Ganador' },
      include: [{ model: Sorteo, as: 'sorteoDetalles' }],
      order: [['actualizado', 'DESC']],
    });

    response
      .status(200)
      .json({
        mensaje: 'Estadísticas obtenidas exitosamente',
        estadisticas: {
          boletos: {
            total: totalBoletos,
            ganadores: boletosGanadores,
            perdedores: boletosPerdedores,
            activos: boletosActivos,
            tasa_victoria: totalBoletos > 0 ? ((boletosGanadores / totalBoletos) * 100).toFixed(2) + '%' : '0%',
          },
          montos: {
            total_apostado: totalApostado.toFixed(2),
            total_ganado: totalGanado.toFixed(2),
            balance: (totalGanado - totalApostado).toFixed(2),
          },
          ultimo_premio: ultimoBoletoGanador
            ? {
                fecha: ultimoBoletoGanador.sorteoDetalles.fecha,
                numero: ultimoBoletoGanador.numero_seleccionado,
                monto: parseFloat(ultimoBoletoGanador.monto_ganado).toFixed(2),
              }
            : null,
        },
      });
  } catch (error) {
    console.error('Error al obtener estadísticas:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
