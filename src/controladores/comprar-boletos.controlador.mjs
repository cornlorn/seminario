import { Op } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';
import {
  Billetera,
  Boleto,
  Jugador,
  Modalidad,
  Notificacion,
  Sorteo,
  Transaccion,
  Usuario,
} from '../modelos/index.mjs';
import { correoCompraBoleto } from '../servicios/correo/compra-boleto.correo.mjs';

// Límites del sistema
const MAX_BOLETOS_POR_COMPRA = 10;
const MAX_APUESTAS_MISMO_NUMERO = 5;

/**
 * Compra boletos para un sorteo
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const comprarBoletos = async (request, response) => {
  const transaction = await sequelize.transaction();

  try {
    const { sorteo_id, boletos } = request.body;
    const usuarioId = request.usuario.id;

    // Validar que se envíen boletos
    if (!boletos || !Array.isArray(boletos) || boletos.length === 0) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'Debe incluir al menos un boleto' });
    }

    // Validar límite de boletos por compra
    if (boletos.length > MAX_BOLETOS_POR_COMPRA) {
      await transaction.rollback();
      return response
        .status(400)
        .json({ mensaje: `No puedes comprar más de ${MAX_BOLETOS_POR_COMPRA} boletos en una sola transacción` });
    }

    // Obtener jugador y billetera
    const jugador = await Jugador.findOne({
      where: { usuario: usuarioId },
      include: [
        { model: Billetera, as: 'billetera' },
        { model: Usuario, as: 'usuarioDetalles' },
      ],
      transaction,
    });

    if (!jugador) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'Perfil de jugador no encontrado' });
    }

    // Obtener sorteo con su modalidad
    const sorteo = await Sorteo.findByPk(sorteo_id, {
      include: [{ model: Modalidad, as: 'modalidadDetalles' }],
      transaction,
    });

    if (!sorteo) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'Sorteo no encontrado' });
    }

    // Validar que el sorteo esté abierto
    if (sorteo.estado !== 'Abierto') {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'El sorteo no está disponible para compras' });
    }

    // Validar que no haya pasado la fecha de cierre
    const ahora = new Date();
    if (new Date(sorteo.fecha_cierre_compras) <= ahora) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'El sorteo ya cerró la venta de boletos' });
    }

    const modalidad = sorteo.modalidadDetalles;

    // Validar y procesar cada boleto
    const boletosValidados = [];
    let montoTotal = 0;
    const numerosContador = {};

    for (const boleto of boletos) {
      const { numero, monto } = boleto;

      // Validar que el número esté en el rango permitido
      const numeroInt = parseInt(numero);
      if (isNaN(numeroInt) || numeroInt < modalidad.rango_numero_min || numeroInt > modalidad.rango_numero_max) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: `El número ${numero} no es válido. Debe estar entre ${modalidad.rango_numero_min} y ${modalidad.rango_numero_max}`,
          });
      }

      // Formatear número con ceros a la izquierda
      const numeroFormateado = numeroInt.toString().padStart(2, '0');

      // Validar monto mínimo
      const montoFloat = parseFloat(monto);
      if (montoFloat < parseFloat(modalidad.precio_minimo)) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: `El monto mínimo por boleto es L${modalidad.precio_minimo}` });
      }

      // Validar que el monto sea múltiplo del valor permitido
      if (montoFloat % parseFloat(modalidad.multiplo_apuesta) !== 0) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: `El monto debe ser múltiplo de L${modalidad.multiplo_apuesta}` });
      }

      // Contar apuestas al mismo número
      numerosContador[numeroFormateado] = (numerosContador[numeroFormateado] || 0) + 1;

      boletosValidados.push({ numero: numeroFormateado, monto: montoFloat });

      montoTotal += montoFloat;
    }

    // Validar límite de apuestas al mismo número en esta compra
    for (const [numero, cantidad] of Object.entries(numerosContador)) {
      if (cantidad > MAX_APUESTAS_MISMO_NUMERO) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: `No puedes apostar más de ${MAX_APUESTAS_MISMO_NUMERO} veces al mismo número (${numero}) en una sola compra`,
          });
      }

      // Verificar apuestas previas del usuario al mismo número en este sorteo
      const apuestasPrevias = await Boleto.count({
        where: { jugador: jugador.id, sorteo: sorteo_id, numero_seleccionado: numero, estado: 'Activo' },
        transaction,
      });

      if (apuestasPrevias + cantidad > MAX_APUESTAS_MISMO_NUMERO) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: `Ya tienes ${apuestasPrevias} apuesta(s) al número ${numero}. El máximo total es ${MAX_APUESTAS_MISMO_NUMERO}`,
          });
      }
    }

    // Validar saldo suficiente
    const saldoActual = parseFloat(jugador.billetera.saldo);
    if (saldoActual < montoTotal) {
      await transaction.rollback();
      return response
        .status(400)
        .json({
          mensaje: `Saldo insuficiente. Necesitas L${montoTotal.toFixed(2)} pero solo tienes L${saldoActual.toFixed(2)}`,
        });
    }

    // Crear los boletos
    const boletosCreados = [];
    for (const boleto of boletosValidados) {
      const nuevoBoleto = await Boleto.create(
        {
          id: crypto.randomUUID(),
          jugador: jugador.id,
          sorteo: sorteo_id,
          numero_seleccionado: boleto.numero,
          monto_apostado: boleto.monto,
          estado: 'Activo',
          fecha_compra: new Date(),
        },
        { transaction },
      );

      boletosCreados.push(nuevoBoleto);
    }

    // Actualizar billetera
    const nuevoSaldo = saldoActual - montoTotal;
    await jugador.billetera.update({ saldo: nuevoSaldo }, { transaction });

    // Crear transacción de compra
    await Transaccion.create(
      {
        id: crypto.randomUUID(),
        usuario: usuarioId,
        tipo: 'Compra',
        concepto: `Compra de ${boletosCreados.length} boleto(s) para sorteo del ${sorteo.fecha} ${sorteo.hora}`,
        monto: -montoTotal,
        saldo_anterior: saldoActual,
        saldo_nuevo: nuevoSaldo,
        referencia: sorteo_id,
        metadata: { sorteo_id: sorteo_id, cantidad_boletos: boletosCreados.length, boletos: boletosValidados },
      },
      { transaction },
    );

    // Actualizar estadísticas del sorteo
    await sorteo.update(
      {
        total_boletos: sorteo.total_boletos + boletosCreados.length,
        total_apostado: parseFloat(sorteo.total_apostado) + montoTotal,
      },
      { transaction },
    );

    // Crear notificación
    await Notificacion.create(
      {
        id: crypto.randomUUID(),
        usuario: usuarioId,
        tipo: 'Compra',
        asunto: 'Compra de boletos confirmada',
        mensaje: `Has comprado ${boletosCreados.length} boleto(s) para el sorteo del ${sorteo.fecha} a las ${sorteo.hora}`,
        leida: false,
        enviada: false,
        referencia: sorteo_id,
        metadata: { sorteo_id: sorteo_id, cantidad_boletos: boletosCreados.length, monto_total: montoTotal },
      },
      { transaction },
    );

    await transaction.commit();

    // Enviar correo de manera asíncrona
    process.nextTick(async () => {
      try {
        await correoCompraBoleto(
          jugador.usuarioDetalles.correo,
          jugador.nombre,
          boletosValidados,
          { fecha: sorteo.fecha, hora: sorteo.hora },
          montoTotal,
        );

        await Notificacion.update(
          { enviada: true },
          { where: { referencia: sorteo_id, tipo: 'Compra', usuario: usuarioId } },
        );
      } catch (error) {
        console.error('Error al enviar correo de confirmación:', error.message);
      }
    });

    response
      .status(201)
      .json({
        mensaje: 'Boletos comprados exitosamente',
        compra: {
          sorteo: { id: sorteo.id, fecha: sorteo.fecha, hora: sorteo.hora },
          boletos: boletosCreados.map((b) => ({
            id: b.id,
            numero: b.numero_seleccionado,
            monto: parseFloat(b.monto_apostado),
            premio_potencial: parseFloat(b.monto_apostado) * modalidad.multiplicador_premio,
          })),
          total_pagado: montoTotal,
          premio_potencial_total: montoTotal * modalidad.multiplicador_premio,
          nuevo_saldo: nuevoSaldo,
        },
      });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al comprar boletos:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor al procesar la compra' });
  }
};
