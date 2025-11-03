/**
 * Controlador: miPerfil (versión completa con utilidades integradas)
 * Incluye perfiles de Administrador, Vendedor y Jugador con todas sus estadísticas.
 */

import { Op } from 'sequelize';
import { Administrador, Billetera, Boleto, Jugador, Sorteo, Transaccion, Usuario, Vendedor } from '../models/index.js';

// =====================
// 🔧 UTILIDADES GLOBALES
// =====================

export const formatoMonto = (valor) => parseFloat(valor || 0).toFixed(2);
export const formatoFecha = (fecha) => new Date(fecha).toISOString();
export const formatoHora = (fecha) => new Date(fecha).toTimeString().slice(0, 5);

// =============================
// 🧩 LÓGICA DE CADA TIPO DE PERFIL
// =============================

async function obtenerPerfilAdministrador(usuarioId) {
  const admin = await Administrador.findOne({ where: { usuario: usuarioId } });
  if (!admin) return {};

  const [usuarios, jugadores, vendedores, sorteos, boletos] = await Promise.all([
    Usuario.count(),
    Jugador.count(),
    Vendedor.count(),
    Sorteo.count(),
    Boleto.count(),
  ]);

  return {
    perfil: { nombre: admin.nombre },
    estadisticas_sistema: {
      usuarios: { total: usuarios, jugadores, vendedores, administradores: usuarios - jugadores - vendedores },
      sorteos: {
        total: sorteos,
        pendientes: await Sorteo.count({ where: { estado: 'Pendiente' } }),
        abiertos: await Sorteo.count({ where: { estado: 'Abierto' } }),
        finalizados: await Sorteo.count({ where: { estado: 'Finalizado' } }),
      },
      boletos: {
        total: boletos,
        activos: await Boleto.count({ where: { estado: 'Activo' } }),
        ganadores: await Boleto.count({ where: { estado: 'Ganador' } }),
      },
    },
  };
}

async function obtenerPerfilVendedor(usuarioId) {
  const vendedor = await Vendedor.findOne({ where: { usuario: usuarioId } });
  if (!vendedor) return {};

  const [depositos, retiros, transacciones] = await Promise.all([
    Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Deposito' } }),
    Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Retiro' } }),
    Transaccion.findAll({
      where: { vendedor: vendedor.id },
      include: [
        {
          model: Usuario,
          as: 'usuarioDetalles',
          attributes: ['correo'],
          include: [{ model: Jugador, as: 'jugador', attributes: ['nombre', 'apellido'] }],
        },
      ],
      order: [['creado', 'DESC']],
      limit: 5,
    }),
  ]);

  const ultimasOperaciones = transacciones.map((op) => ({
    id: op.id,
    tipo: op.tipo,
    monto: formatoMonto(op.monto),
    jugador: op.usuarioDetalles.jugador
      ? `${op.usuarioDetalles.jugador.nombre} ${op.usuarioDetalles.jugador.apellido}`
      : 'N/A',
    fecha: formatoFecha(op.creado),
  }));

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const operacionesHoy = await Transaccion.findAll({
    where: { vendedor: vendedor.id, creado: { [Op.gte]: hoy } },
    attributes: ['tipo', 'monto'],
  });

  let depositosHoy = 0,
    retirosHoy = 0,
    comisionesHoy = 0;

  operacionesHoy.forEach((op) => {
    if (op.tipo === 'Deposito') {
      depositosHoy += parseFloat(op.monto);
      comisionesHoy += (parseFloat(op.monto) * parseFloat(vendedor.comision_porcentaje)) / 100;
    } else if (op.tipo === 'Retiro') {
      retirosHoy += Math.abs(parseFloat(op.monto));
    }
  });

  return {
    perfil: {
      nombre: vendedor.nombre,
      apellido: vendedor.apellido,
      telefono: vendedor.telefono,
      direccion: vendedor.direccion,
      comision_porcentaje: parseFloat(vendedor.comision_porcentaje),
    },
    estadisticas: {
      depositos: { total: formatoMonto(vendedor.total_depositado), cantidad: depositos },
      retiros: { total: formatoMonto(vendedor.total_retirado), cantidad: retiros },
      comisiones: { total: formatoMonto(vendedor.total_comisiones) },
    },
    ultimas_operaciones: ultimasOperaciones,
    resumen_hoy: {
      depositos: formatoMonto(depositosHoy),
      retiros: formatoMonto(retirosHoy),
      comisiones_estimadas: formatoMonto(comisionesHoy),
    },
  };
}

async function obtenerPerfilJugador(usuarioId) {
  const jugador = await Jugador.findOne({
    where: { usuario: usuarioId },
    include: [{ model: Billetera, as: 'billetera' }],
  });
  if (!jugador) return {};

  const [total, activos, ganadores, perdedores] = await Promise.all([
    Boleto.count({ where: { jugador: jugador.id } }),
    Boleto.count({ where: { jugador: jugador.id, estado: 'Activo' } }),
    Boleto.count({ where: { jugador: jugador.id, estado: 'Ganador' } }),
    Boleto.count({ where: { jugador: jugador.id, estado: 'Perdedor' } }),
  ]);

  const boletos = await Boleto.findAll({
    where: { jugador: jugador.id },
    attributes: ['monto_apostado', 'monto_ganado'],
  });
  let totalApostado = 0,
    totalGanado = 0;
  boletos.forEach((b) => {
    totalApostado += parseFloat(b.monto_apostado);
    if (b.monto_ganado) totalGanado += parseFloat(b.monto_ganado);
  });

  const balance = totalGanado - totalApostado;

  // Últimos boletos y transacciones
  const [ultimosBoletos, ultimasTransacciones, ultimoPremio] = await Promise.all([
    Boleto.findAll({
      where: { jugador: jugador.id },
      include: [{ model: Sorteo, as: 'sorteoDetalles', attributes: ['fecha', 'hora', 'numero_ganador', 'estado'] }],
      order: [['creado', 'DESC']],
      limit: 5,
    }),
    Transaccion.findAll({ where: { usuario: usuarioId }, order: [['creado', 'DESC']], limit: 5 }),
    Boleto.findOne({
      where: { jugador: jugador.id, estado: 'Ganador' },
      include: [{ model: Sorteo, as: 'sorteoDetalles', attributes: ['fecha', 'hora'] }],
      order: [['actualizado', 'DESC']],
    }),
  ]);

  const ultimosBoletosFormat = ultimosBoletos.map((boleto) => ({
    id: boleto.id,
    numero: boleto.numero_seleccionado,
    monto_apostado: formatoMonto(boleto.monto_apostado),
    estado: boleto.estado,
    premio: boleto.monto_ganado ? formatoMonto(boleto.monto_ganado) : null,
    sorteo: {
      fecha: boleto.sorteoDetalles.fecha,
      hora: formatoHora(boleto.sorteoDetalles.hora),
      numero_ganador: boleto.sorteoDetalles.numero_ganador,
    },
    fecha_compra: formatoFecha(boleto.fecha_compra),
  }));

  const ultimasTransaccionesFormat = ultimasTransacciones.map((t) => ({
    id: t.id,
    tipo: t.tipo,
    concepto: t.concepto,
    monto: formatoMonto(t.monto),
    saldo_nuevo: formatoMonto(t.saldo_nuevo),
    fecha: formatoFecha(t.creado),
  }));

  const ultimoPremioFormat = ultimoPremio
    ? {
        numero: ultimoPremio.numero_seleccionado,
        monto: formatoMonto(ultimoPremio.monto_ganado),
        fecha: formatoFecha(ultimoPremio.sorteoDetalles.fecha),
        hora: formatoHora(ultimoPremio.sorteoDetalles.hora),
      }
    : null;

  // Actividad mensual
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [boletosEsteMes, premiosEsteMes] = await Promise.all([
    Boleto.count({ where: { jugador: jugador.id, fecha_compra: { [Op.gte]: inicioMes } } }),
    Boleto.count({ where: { jugador: jugador.id, estado: 'Ganador', actualizado: { [Op.gte]: inicioMes } } }),
  ]);

  return {
    perfil: {
      nombre: jugador.nombre,
      apellido: jugador.apellido,
      telefono: jugador.telefono,
      nacimiento: jugador.nacimiento,
      avatar: jugador.avatar,
    },
    billetera: { saldo_actual: formatoMonto(jugador.billetera.saldo) },
    estadisticas: {
      boletos: {
        total,
        activos,
        ganadores,
        perdedores,
        tasa_victoria: total > 0 ? ((ganadores / (ganadores + perdedores)) * 100).toFixed(2) : '0.00',
      },
      montos: {
        total_apostado: formatoMonto(totalApostado),
        total_ganado: formatoMonto(totalGanado),
        balance: formatoMonto(balance),
        balance_positivo: balance >= 0,
      },
    },
    ultimos_boletos: ultimosBoletosFormat,
    ultimas_transacciones: ultimasTransaccionesFormat,
    ultimo_premio: ultimoPremioFormat,
    actividad_mes: { boletos_comprados: boletosEsteMes, premios_ganados: premiosEsteMes },
  };
}

// ===========================
// 🚀 CONTROLADOR PRINCIPAL
// ===========================

export const miPerfil = async (request, response) => {
  try {
    const { id: usuarioId, rol } = request.usuario;
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'correo', 'rol', 'estado', 'creado', 'actualizado'],
    });

    if (!usuario) return response.status(404).json({ mensaje: 'Usuario no encontrado' });

    const base = {
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
        fecha_registro: formatoFecha(usuario.creado),
        ultima_actualizacion: formatoFecha(usuario.actualizado),
      },
    };

    let perfil = {};
    if (rol === 'Administrador') perfil = await obtenerPerfilAdministrador(usuarioId);
    if (rol === 'Vendedor') perfil = await obtenerPerfilVendedor(usuarioId);
    if (rol === 'Jugador') perfil = await obtenerPerfilJugador(usuarioId);

    response.status(200).json({ mensaje: 'Perfil obtenido exitosamente', ...base, ...perfil });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
