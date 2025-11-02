import { Op } from 'sequelize';
import {
  Administrador,
  Billetera,
  Boleto,
  Jugador,
  Sorteo,
  Transaccion,
  Usuario,
  Vendedor,
} from '../modelos/index.mjs';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const miPerfil = async (request, response) => {
  try {
    const usuarioId = request.usuario.id;
    const rol = request.usuario.rol;

    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'correo', 'rol', 'estado', 'creado', 'actualizado'],
    });

    if (!usuario) {
      return response.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    let perfilCompleto = {
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
        fecha_registro: usuario.creado,
        ultima_actualizacion: usuario.actualizado,
      },
    };

    if (rol === 'Administrador') {
      const admin = await Administrador.findOne({ where: { usuario: usuarioId } });

      if (admin) {
        perfilCompleto.perfil = { nombre: admin.nombre };

        const [totalUsuarios, totalJugadores, totalVendedores, totalSorteos, totalBoletos] = await Promise.all([
          Usuario.count(),
          Jugador.count(),
          Vendedor.count(),
          Sorteo.count(),
          Boleto.count(),
        ]);

        perfilCompleto.estadisticas_sistema = {
          usuarios: {
            total: totalUsuarios,
            jugadores: totalJugadores,
            vendedores: totalVendedores,
            administradores: totalUsuarios - totalJugadores - totalVendedores,
          },
          sorteos: {
            total: totalSorteos,
            pendientes: await Sorteo.count({ where: { estado: 'Pendiente' } }),
            abiertos: await Sorteo.count({ where: { estado: 'Abierto' } }),
            finalizados: await Sorteo.count({ where: { estado: 'Finalizado' } }),
          },
          boletos: {
            total: totalBoletos,
            activos: await Boleto.count({ where: { estado: 'Activo' } }),
            ganadores: await Boleto.count({ where: { estado: 'Ganador' } }),
          },
        };
      }
    }

    if (rol === 'Vendedor') {
      const vendedor = await Vendedor.findOne({ where: { usuario: usuarioId } });

      if (vendedor) {
        perfilCompleto.perfil = {
          nombre: vendedor.nombre,
          apellido: vendedor.apellido,
          telefono: vendedor.telefono,
          direccion: vendedor.direccion,
          comision_porcentaje: parseFloat(vendedor.comision_porcentaje),
        };

        perfilCompleto.estadisticas = {
          depositos: {
            total: parseFloat(vendedor.total_depositado).toFixed(2),
            cantidad: await Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Deposito' } }),
          },
          retiros: {
            total: parseFloat(vendedor.total_retirado).toFixed(2),
            cantidad: await Transaccion.count({ where: { vendedor: vendedor.id, tipo: 'Retiro' } }),
          },
          comisiones: { total: parseFloat(vendedor.total_comisiones).toFixed(2) },
        };

        const ultimasOperaciones = await Transaccion.findAll({
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
        });

        perfilCompleto.ultimas_operaciones = ultimasOperaciones.map((op) => ({
          id: op.id,
          tipo: op.tipo,
          monto: parseFloat(op.monto).toFixed(2),
          jugador: op.usuarioDetalles.jugador
            ? `${op.usuarioDetalles.jugador.nombre} ${op.usuarioDetalles.jugador.apellido}`
            : 'N/A',
          fecha: op.creado,
        }));

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const operacionesHoy = await Transaccion.findAll({
          where: { vendedor: vendedor.id, creado: { [Op.gte]: hoy } },
          attributes: ['tipo', 'monto'],
        });

        let depositosHoy = 0;
        let retirosHoy = 0;
        let comisionesHoy = 0;

        operacionesHoy.forEach((op) => {
          if (op.tipo === 'Deposito') {
            depositosHoy += parseFloat(op.monto);
            comisionesHoy += (parseFloat(op.monto) * parseFloat(vendedor.comision_porcentaje)) / 100;
          } else if (op.tipo === 'Retiro') {
            retirosHoy += Math.abs(parseFloat(op.monto));
          }
        });

        perfilCompleto.resumen_hoy = {
          depositos: depositosHoy.toFixed(2),
          retiros: retirosHoy.toFixed(2),
          comisiones_estimadas: comisionesHoy.toFixed(2),
        };
      }
    }

    if (rol === 'Jugador') {
      const jugador = await Jugador.findOne({
        where: { usuario: usuarioId },
        include: [{ model: Billetera, as: 'billetera' }],
      });

      if (jugador) {
        perfilCompleto.perfil = {
          nombre: jugador.nombre,
          apellido: jugador.apellido,
          telefono: jugador.telefono,
          nacimiento: jugador.nacimiento,
          avatar: jugador.avatar,
        };

        perfilCompleto.billetera = { saldo_actual: parseFloat(jugador.billetera.saldo).toFixed(2) };

        const [totalBoletos, boletosActivos, boletosGanadores, boletosPerdedores] = await Promise.all([
          Boleto.count({ where: { jugador: jugador.id } }),
          Boleto.count({ where: { jugador: jugador.id, estado: 'Activo' } }),
          Boleto.count({ where: { jugador: jugador.id, estado: 'Ganador' } }),
          Boleto.count({ where: { jugador: jugador.id, estado: 'Perdedor' } }),
        ]);

        const boletos = await Boleto.findAll({
          where: { jugador: jugador.id },
          attributes: ['monto_apostado', 'monto_ganado'],
        });

        let totalApostado = 0;
        let totalGanado = 0;

        boletos.forEach((boleto) => {
          totalApostado += parseFloat(boleto.monto_apostado);
          if (boleto.monto_ganado) {
            totalGanado += parseFloat(boleto.monto_ganado);
          }
        });

        const balance = totalGanado - totalApostado;

        perfilCompleto.estadisticas = {
          boletos: {
            total: totalBoletos,
            activos: boletosActivos,
            ganadores: boletosGanadores,
            perdedores: boletosPerdedores,
            tasa_victoria:
              totalBoletos > 0
                ? ((boletosGanadores / (boletosGanadores + boletosPerdedores)) * 100).toFixed(2)
                : '0.00',
          },
          montos: {
            total_apostado: totalApostado.toFixed(2),
            total_ganado: totalGanado.toFixed(2),
            balance: balance.toFixed(2),
            balance_positivo: balance >= 0,
          },
        };

        const ultimosBoletos = await Boleto.findAll({
          where: { jugador: jugador.id },
          include: [{ model: Sorteo, as: 'sorteoDetalles', attributes: ['fecha', 'hora', 'numero_ganador', 'estado'] }],
          order: [['creado', 'DESC']],
          limit: 5,
        });

        perfilCompleto.ultimos_boletos = ultimosBoletos.map((boleto) => ({
          id: boleto.id,
          numero: boleto.numero_seleccionado,
          monto_apostado: parseFloat(boleto.monto_apostado).toFixed(2),
          estado: boleto.estado,
          premio: boleto.monto_ganado ? parseFloat(boleto.monto_ganado).toFixed(2) : null,
          sorteo: {
            fecha: boleto.sorteoDetalles.fecha,
            hora: boleto.sorteoDetalles.hora,
            numero_ganador: boleto.sorteoDetalles.numero_ganador,
          },
          fecha_compra: boleto.fecha_compra,
        }));

        const ultimasTransacciones = await Transaccion.findAll({
          where: { usuario: usuarioId },
          order: [['creado', 'DESC']],
          limit: 5,
        });

        perfilCompleto.ultimas_transacciones = ultimasTransacciones.map((t) => ({
          id: t.id,
          tipo: t.tipo,
          concepto: t.concepto,
          monto: parseFloat(t.monto).toFixed(2),
          saldo_nuevo: parseFloat(t.saldo_nuevo).toFixed(2),
          fecha: t.creado,
        }));

        const ultimoPremio = await Boleto.findOne({
          where: { jugador: jugador.id, estado: 'Ganador' },
          include: [{ model: Sorteo, as: 'sorteoDetalles', attributes: ['fecha', 'hora'] }],
          order: [['actualizado', 'DESC']],
        });

        if (ultimoPremio) {
          perfilCompleto.ultimo_premio = {
            numero: ultimoPremio.numero_seleccionado,
            monto: parseFloat(ultimoPremio.monto_ganado).toFixed(2),
            fecha: ultimoPremio.sorteoDetalles.fecha,
            hora: ultimoPremio.sorteoDetalles.hora,
          };
        }

        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);

        const [boletosEsteMes, premiosEsteMes] = await Promise.all([
          Boleto.count({ where: { jugador: jugador.id, fecha_compra: { [Op.gte]: inicioMes } } }),
          Boleto.count({ where: { jugador: jugador.id, estado: 'Ganador', actualizado: { [Op.gte]: inicioMes } } }),
        ]);

        perfilCompleto.actividad_mes = { boletos_comprados: boletosEsteMes, premios_ganados: premiosEsteMes };
      }
    }

    response.status(200).json({ mensaje: 'Perfil obtenido exitosamente', ...perfilCompleto });
  } catch (error) {
    console.error('Error al obtener perfil:');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
