import { randomUUID } from 'crypto';
import { sequelize } from '../config/database.config.js';
import { Billetera, Boleto, Jugador, Modalidad, Notificacion, Sorteo, Transaccion, Usuario } from '../models/index.js';
import { correoCompraBoleto } from '../services/email/buy-ticket.email.js';

const MAX_BOLETOS_POR_COMPRA = 10;
const MAX_APUESTAS_MISMO_NUMERO = 5;

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const comprarBoletos = async (request, response) => {
  const transaction = await sequelize.transaction();

  try {
    const { sorteo_id, boletos } = request.body;
    const usuarioId = request.usuario.id;

    if (!boletos || !Array.isArray(boletos) || boletos.length === 0) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'Debe incluir al menos un boleto' });
    }

    if (boletos.length > MAX_BOLETOS_POR_COMPRA) {
      await transaction.rollback();
      return response
        .status(400)
        .json({ mensaje: `No puedes comprar más de ${MAX_BOLETOS_POR_COMPRA} boletos en una sola transacción` });
    }

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

    const sorteo = await Sorteo.findByPk(sorteo_id, {
      include: [{ model: Modalidad, as: 'modalidadDetalles' }],
      transaction,
    });

    if (!sorteo) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'Sorteo no encontrado' });
    }

    if (sorteo.estado !== 'Abierto') {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'El sorteo no está disponible para compras' });
    }

    const ahora = new Date();
    if (new Date(sorteo.fecha_cierre_compras) <= ahora) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'El sorteo ya cerró la venta de boletos' });
    }

    const modalidad = sorteo.modalidadDetalles;

    const boletosValidados = [];
    let montoTotal = 0;
    const numerosContador = {};

    for (const boleto of boletos) {
      const { numero, monto } = boleto;

      const numeroInt = parseInt(numero);
      if (isNaN(numeroInt) || numeroInt < modalidad.rango_numero_min || numeroInt > modalidad.rango_numero_max) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: `El número ${numero} no es válido. Debe estar entre ${modalidad.rango_numero_min} y ${modalidad.rango_numero_max}`,
          });
      }

      // Determine padding based on game range
      const padLength = modalidad.rango_numero_max >= 100 ? 3 : 2;
      const numeroFormateado = numeroInt.toString().padStart(padLength, '0');

      const montoFloat = parseFloat(monto);
      if (montoFloat < parseFloat(modalidad.precio_minimo)) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: `El monto mínimo por boleto es L${modalidad.precio_minimo}` });
      }

      if (montoFloat % parseFloat(modalidad.multiplo_apuesta) !== 0) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: `El monto debe ser múltiplo de L${modalidad.multiplo_apuesta}` });
      }

      numerosContador[numeroFormateado] = (numerosContador[numeroFormateado] || 0) + 1;

      boletosValidados.push({ numero: numeroFormateado, monto: montoFloat });

      montoTotal += montoFloat;
    }

    for (const [numero, cantidad] of Object.entries(numerosContador)) {
      if (cantidad > MAX_APUESTAS_MISMO_NUMERO) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: `No puedes apostar más de ${MAX_APUESTAS_MISMO_NUMERO} veces al mismo número (${numero}) en una sola compra`,
          });
      }

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

    const saldoActual = parseFloat(jugador.billetera.saldo);
    if (saldoActual < montoTotal) {
      await transaction.rollback();
      return response
        .status(400)
        .json({
          mensaje: `Saldo insuficiente. Necesitas L${montoTotal.toFixed(2)} pero solo tienes L${saldoActual.toFixed(2)}`,
        });
    }

    const boletosCreados = [];
    for (const boleto of boletosValidados) {
      const nuevoBoleto = await Boleto.create(
        {
          id: randomUUID(),
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

    const nuevoSaldo = saldoActual - montoTotal;
    await jugador.billetera.update({ saldo: nuevoSaldo }, { transaction });

    const cantidad = boletosCreados.length;
    const plural = cantidad > 1 ? 's' : '';
    const horaFormateada = sorteo.hora.slice(0, 5);

    const concepto = `Compra de ${cantidad} boleto${plural} para sorteo del ${sorteo.fecha} ${horaFormateada}`;

    await Transaccion.create(
      {
        id: randomUUID(),
        usuario: usuarioId,
        tipo: 'Compra',
        concepto: concepto,
        monto: -montoTotal,
        saldo_anterior: saldoActual,
        saldo_nuevo: nuevoSaldo,
        referencia: sorteo_id,
        metadata: { sorteo_id, cantidad_boletos: cantidad, boletos: boletosValidados },
      },
      { transaction },
    );

    await sorteo.update(
      {
        total_boletos: sorteo.total_boletos + boletosCreados.length,
        total_apostado: parseFloat(sorteo.total_apostado) + montoTotal,
      },
      { transaction },
    );

    await Notificacion.create(
      {
        id: randomUUID(),
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
