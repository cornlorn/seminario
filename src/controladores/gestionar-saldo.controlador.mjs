import { sequelize } from '../config/database.config.mjs';
import { Billetera, Jugador, Notificacion, Transaccion, Usuario, Vendedor } from '../modelos/index.mjs';
import { correoDepositoSaldo } from '../servicios/correo/deposito-saldo.correo.mjs';
import { correoRetiroSaldo } from '../servicios/correo/retiro-saldo.correo.mjs';
import { formatearMoneda } from '../utilidades/respuesta.utilidad.mjs';
import {
  crearDatosNotificacion,
  crearDatosTransaccion,
  validarMontoConLimites,
} from '../utilidades/transaccion.utilidad.mjs';

export const MONTOS_PREDETERMINADOS = [25, 50, 100, 200, 500, 1000];

const MONTO_MINIMO_DEPOSITO = 25;
const MONTO_MAXIMO_DEPOSITO = 1000;
const MONTO_MAXIMO_RETIRO = 10000;

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const agregarSaldo = async (request, response) => {
  const transaction = await sequelize.transaction();

  try {
    const { correo_jugador, monto } = request.body;
    const vendedorUsuarioId = request.usuario.id;

    const validacion = validarMontoConLimites(monto, { min: MONTO_MINIMO_DEPOSITO, max: MONTO_MAXIMO_DEPOSITO });
    if (!validacion.valido) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: validacion.error });
    }
    const montoFloat = validacion.montoFloat;

    const vendedor = await Vendedor.findOne({
      where: { usuario: vendedorUsuarioId },
      include: [{ model: Usuario, as: 'usuarioDetalles' }],
      transaction,
    });

    if (!vendedor) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'Perfil de vendedor no encontrado' });
    }

    const usuarioJugador = await Usuario.findOne({
      where: { correo: correo_jugador, rol: 'Jugador' },
      include: [{ model: Jugador, as: 'jugador', include: [{ model: Billetera, as: 'billetera' }] }],
      transaction,
    });

    if (!usuarioJugador || !usuarioJugador.jugador) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'No se encontró un jugador con ese correo electrónico' });
    }

    const jugador = usuarioJugador.jugador;
    const billetera = jugador.billetera;

    const saldoAnterior = parseFloat(billetera.saldo);
    const saldoNuevo = saldoAnterior + montoFloat;

    await billetera.update({ saldo: saldoNuevo }, { transaction });

    const comision = (montoFloat * parseFloat(vendedor.comision_porcentaje)) / 100;
    const vendedorNombre = `${vendedor.nombre} ${vendedor.apellido}`;

    const transaccionJugador = await Transaccion.create(
      crearDatosTransaccion({
        usuario: usuarioJugador.id,
        tipo: 'Deposito',
        concepto: `Depósito realizado por ${vendedorNombre}`,
        monto: montoFloat,
        saldoAnterior,
        saldoNuevo,
        vendedor: vendedor.id,
        metadata: { vendedor_id: vendedor.id, vendedor_nombre: vendedorNombre, comision: comision },
      }),
      { transaction },
    );

    await vendedor.update(
      {
        total_depositado: parseFloat(vendedor.total_depositado) + montoFloat,
        total_comisiones: parseFloat(vendedor.total_comisiones) + comision,
      },
      { transaction },
    );

    await Notificacion.create(
      crearDatosNotificacion({
        usuario: usuarioJugador.id,
        asunto: 'Depósito realizado',
        mensaje: `Se ha agregado L${formatearMoneda(montoFloat)} a tu cuenta. Nuevo saldo: L${formatearMoneda(saldoNuevo)}`,
        referencia: transaccionJugador.id,
        metadata: { monto: montoFloat, vendedor: vendedorNombre },
      }),
      { transaction },
    );

    await transaction.commit();

    process.nextTick(async () => {
      try {
        await correoDepositoSaldo(usuarioJugador.correo, jugador.nombre, montoFloat, saldoNuevo, vendedorNombre);

        await Notificacion.update({ enviada: true }, { where: { referencia: transaccionJugador.id } });
      } catch (error) {
        console.error('Error al enviar correo de depósito:', error.message);
      }
    });

    response
      .status(200)
      .json({
        mensaje: 'Depósito realizado exitosamente',
        deposito: {
          jugador: {
            nombre: `${jugador.nombre} ${jugador.apellido}`,
            correo: usuarioJugador.correo,
            saldo_anterior: formatearMoneda(saldoAnterior),
            saldo_nuevo: formatearMoneda(saldoNuevo),
          },
          monto_depositado: formatearMoneda(montoFloat),
          comision_ganada: formatearMoneda(comision),
          fecha: new Date(),
        },
      });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar saldo:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor al procesar el depósito' });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const retirarSaldo = async (request, response) => {
  const transaction = await sequelize.transaction();

  try {
    const { correo_jugador, monto } = request.body;
    const vendedorUsuarioId = request.usuario.id;

    const validacion = validarMontoConLimites(monto, { max: MONTO_MAXIMO_RETIRO });
    if (!validacion.valido) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: validacion.error });
    }
    const montoFloat = validacion.montoFloat;

    const vendedor = await Vendedor.findOne({
      where: { usuario: vendedorUsuarioId },
      include: [{ model: Usuario, as: 'usuarioDetalles' }],
      transaction,
    });

    if (!vendedor) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'Perfil de vendedor no encontrado' });
    }

    const usuarioJugador = await Usuario.findOne({
      where: { correo: correo_jugador, rol: 'Jugador' },
      include: [{ model: Jugador, as: 'jugador', include: [{ model: Billetera, as: 'billetera' }] }],
      transaction,
    });

    if (!usuarioJugador || !usuarioJugador.jugador) {
      await transaction.rollback();
      return response.status(404).json({ mensaje: 'No se encontró un jugador con ese correo electrónico' });
    }

    const jugador = usuarioJugador.jugador;
    const billetera = jugador.billetera;

    const saldoAnterior = parseFloat(billetera.saldo);

    if (saldoAnterior < montoFloat) {
      await transaction.rollback();
      return response
        .status(400)
        .json({ mensaje: `Saldo insuficiente. El jugador tiene L${formatearMoneda(saldoAnterior)} disponible` });
    }

    const saldoNuevo = saldoAnterior - montoFloat;

    await billetera.update({ saldo: saldoNuevo }, { transaction });

    const vendedorNombre = `${vendedor.nombre} ${vendedor.apellido}`;

    const transaccionJugador = await Transaccion.create(
      crearDatosTransaccion({
        usuario: usuarioJugador.id,
        tipo: 'Retiro',
        concepto: `Retiro procesado por ${vendedorNombre}`,
        monto: -montoFloat,
        saldoAnterior,
        saldoNuevo,
        vendedor: vendedor.id,
        metadata: { vendedor_id: vendedor.id, vendedor_nombre: vendedorNombre },
      }),
      { transaction },
    );

    await vendedor.update({ total_retirado: parseFloat(vendedor.total_retirado) + montoFloat }, { transaction });

    await Notificacion.create(
      crearDatosNotificacion({
        usuario: usuarioJugador.id,
        asunto: 'Retiro realizado',
        mensaje: `Se ha retirado L${formatearMoneda(montoFloat)} de tu cuenta. Nuevo saldo: L${formatearMoneda(saldoNuevo)}`,
        referencia: transaccionJugador.id,
        metadata: { monto: montoFloat, vendedor: vendedorNombre },
      }),
      { transaction },
    );

    await transaction.commit();

    process.nextTick(async () => {
      try {
        await correoRetiroSaldo(usuarioJugador.correo, jugador.nombre, montoFloat, saldoNuevo, vendedorNombre);

        await Notificacion.update({ enviada: true }, { where: { referencia: transaccionJugador.id } });
      } catch (error) {
        console.error('Error al enviar correo de retiro:', error.message);
      }
    });

    response
      .status(200)
      .json({
        mensaje: 'Retiro realizado exitosamente',
        retiro: {
          jugador: {
            nombre: `${jugador.nombre} ${jugador.apellido}`,
            correo: usuarioJugador.correo,
            saldo_anterior: formatearMoneda(saldoAnterior),
            saldo_nuevo: formatearMoneda(saldoNuevo),
          },
          monto_retirado: formatearMoneda(montoFloat),
          fecha: new Date(),
        },
      });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al retirar saldo:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor al procesar el retiro' });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const buscarJugador = async (request, response) => {
  try {
    const { correo } = request.query;

    if (!correo) {
      return response.status(400).json({ mensaje: 'El correo es requerido' });
    }

    const usuario = await Usuario.findOne({
      where: { correo, rol: 'Jugador' },
      include: [{ model: Jugador, as: 'jugador', include: [{ model: Billetera, as: 'billetera' }] }],
    });

    if (!usuario || !usuario.jugador) {
      return response.status(404).json({ mensaje: 'No se encontró un jugador con ese correo electrónico' });
    }

    const jugador = usuario.jugador;

    response
      .status(200)
      .json({
        mensaje: 'Jugador encontrado',
        jugador: {
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          correo: usuario.correo,
          telefono: jugador.telefono,
          avatar: jugador.avatar,
          saldo_actual: formatearMoneda(jugador.billetera.saldo),
          fecha_registro: usuario.creado,
        },
      });
  } catch (error) {
    console.error('Error al buscar jugador:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const misOperaciones = async (request, response) => {
  try {
    const vendedorUsuarioId = request.usuario.id;
    const { tipo, limite = 50, pagina = 1 } = request.query;

    const vendedor = await Vendedor.findOne({ where: { usuario: vendedorUsuarioId } });

    if (!vendedor) {
      return response.status(404).json({ mensaje: 'Perfil de vendedor no encontrado' });
    }

    const where = { vendedor: vendedor.id };
    if (tipo && (tipo === 'Deposito' || tipo === 'Retiro')) {
      where.tipo = tipo;
    }

    const limiteInt = parseInt(limite);
    const paginaInt = parseInt(pagina);
    const offset = (paginaInt - 1) * limiteInt;

    const { count, rows: transacciones } = await Transaccion.findAndCountAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuarioDetalles',
          attributes: ['correo'],
          include: [{ model: Jugador, as: 'jugador', attributes: ['nombre', 'apellido'] }],
        },
      ],
      order: [['creado', 'DESC']],
      limit: limiteInt,
      offset: offset,
    });

    const operacionesFormateadas = transacciones.map((t) => ({
      id: t.id,
      tipo: t.tipo,
      jugador: {
        nombre: `${t.usuarioDetalles.jugador.nombre} ${t.usuarioDetalles.jugador.apellido}`,
        correo: t.usuarioDetalles.correo,
      },
      monto: formatearMoneda(t.monto),
      comision: t.metadata?.comision ? formatearMoneda(t.metadata.comision) : null,
      fecha: t.creado,
    }));

    response
      .status(200)
      .json({
        mensaje: 'Historial de operaciones obtenido exitosamente',
        paginacion: { total: count, pagina: paginaInt, limite: limiteInt, total_paginas: Math.ceil(count / limiteInt) },
        operaciones: operacionesFormateadas,
      });
  } catch (error) {
    console.error('Error al obtener historial de operaciones:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const misEstadisticasVendedor = async (request, response) => {
  try {
    const vendedorUsuarioId = request.usuario.id;

    const vendedor = await Vendedor.findOne({ where: { usuario: vendedorUsuarioId } });

    if (!vendedor) {
      return response.status(404).json({ mensaje: 'Perfil de vendedor no encontrado' });
    }

    const totalDepositos = await Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Deposito' } });

    const totalRetiros = await Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Retiro' } });

    response
      .status(200)
      .json({
        mensaje: 'Estadísticas obtenidas exitosamente',
        estadisticas: {
          depositos: { cantidad: totalDepositos, total: formatearMoneda(vendedor.total_depositado) },
          retiros: { cantidad: totalRetiros, total: formatearMoneda(vendedor.total_retirado) },
          comisiones: { total: formatearMoneda(vendedor.total_comisiones) },
          comision_porcentaje: formatearMoneda(vendedor.comision_porcentaje) + '%',
        },
      });
  } catch (error) {
    console.error('Error al obtener estadísticas:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
