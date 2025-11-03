import { randomUUID } from 'crypto';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.config.js';
import { Billetera, Boleto, Jugador, Modalidad, Notificacion, Sorteo, Transaccion, Usuario } from '../models/index.js';
import { correoResultadoSorteo } from './email/draw-result.email.js';
import { correoPremioGanado } from './email/prize-won.email.js';

const MIXEA_TRES_REPEATED_DIGITS_MULTIPLIER = 200;
const REQUIRED_DIGIT_COUNT = 2;
const UNIQUE_DIGIT_TYPES = 2;

const generarNumeroGanador = (min, max) => {
  const numero = Math.floor(Math.random() * (max - min + 1)) + min;
  const padLength = max >= 100 ? 3 : 2;
  return numero.toString().padStart(padLength, '0');
};

const tieneDosDigitosRepetidos = (numero) => {
  if (numero.length !== 3) return false;

  const digitos = numero.split('');
  const contador = {};

  for (const digito of digitos) {
    contador[digito] = (contador[digito] || 0) + 1;
  }

  const valores = Object.values(contador);
  return valores.includes(REQUIRED_DIGIT_COUNT) && valores.length === UNIQUE_DIGIT_TYPES;
};

const ordenarDigitos = (numero) => {
  return numero.split('').sort().join('');
};

const esGanador = (numeroSeleccionado, numeroGanador, nombreModalidad) => {
  if (nombreModalidad === 'Mixeá Tres') {
    // Para Mixeá Tres, el número gana si los dígitos coinciden en cualquier orden
    return ordenarDigitos(numeroSeleccionado) === ordenarDigitos(numeroGanador);
  }
  // Para otras modalidades (Ordená Tres, Diaria Simple), debe coincidir exactamente
  return numeroSeleccionado === numeroGanador;
};

export const ejecutarSorteo = async (sorteoId) => {
  const transaction = await sequelize.transaction();

  try {
    const sorteo = await Sorteo.findByPk(sorteoId, {
      include: [{ model: Modalidad, as: 'modalidadDetalles' }],
      transaction,
    });

    if (!sorteo) {
      throw new Error('Sorteo no encontrado');
    }

    if (sorteo.estado !== 'Cerrado') {
      throw new Error('El sorteo debe estar cerrado para poder ejecutarse');
    }

    const modalidad = sorteo.modalidadDetalles;
    const numeroGanador = generarNumeroGanador(modalidad.rango_numero_min, modalidad.rango_numero_max);

    await sorteo.update({ numero_ganador: numeroGanador, estado: 'Finalizado' }, { transaction });

    // Obtener todos los boletos activos para este sorteo
    const todosLosBoletos = await Boleto.findAll({
      where: { sorteo: sorteoId, estado: 'Activo' },
      include: [
        {
          model: Jugador,
          as: 'jugadorDetalles',
          include: [
            { model: Usuario, as: 'usuarioDetalles' },
            { model: Billetera, as: 'billetera' },
          ],
        },
      ],
      transaction,
    });

    const boletosGanadores = [];
    const boletosPerdedores = [];

    // Determinar ganadores y perdedores según la modalidad
    for (const boleto of todosLosBoletos) {
      if (esGanador(boleto.numero_seleccionado, numeroGanador, modalidad.nombre)) {
        boletosGanadores.push(boleto);
      } else {
        boletosPerdedores.push(boleto);
      }
    }

    // Actualizar boletos perdedores
    for (const boleto of boletosPerdedores) {
      await boleto.update({ estado: 'Perdedor' }, { transaction });
    }

    let totalPremios = 0;
    const ganadores = [];

    for (const boleto of boletosGanadores) {
      // Calcular el multiplicador de premio
      let multiplicadorPremio = modalidad.multiplicador_premio;

      // Para Mixeá Tres, si el número tiene dos dígitos repetidos, duplicar el premio
      if (modalidad.nombre === 'Mixeá Tres' && tieneDosDigitosRepetidos(boleto.numero_seleccionado)) {
        multiplicadorPremio = MIXEA_TRES_REPEATED_DIGITS_MULTIPLIER;
      }

      const montoGanado = boleto.monto_apostado * multiplicadorPremio;

      await boleto.update({ estado: 'Ganador', monto_ganado: montoGanado }, { transaction });

      const billetera = boleto.jugadorDetalles.billetera;
      const saldoAnterior = parseFloat(billetera.saldo);
      const saldoNuevo = saldoAnterior + montoGanado;

      await billetera.update({ saldo: saldoNuevo }, { transaction });

      await Transaccion.create(
        {
          id: randomUUID(),
          usuario: boleto.jugadorDetalles.usuario,
          tipo: 'Premio',
          concepto: `Premio del sorteo ${sorteo.fecha} ${sorteo.hora}`,
          monto: montoGanado,
          saldo_anterior: saldoAnterior,
          saldo_nuevo: saldoNuevo,
          referencia: boleto.id,
          metadata: {
            sorteo_id: sorteo.id,
            numero_ganador: numeroGanador,
            numero_apostado: boleto.numero_seleccionado,
            monto_apostado: boleto.monto_apostado,
          },
        },
        { transaction },
      );

      await Notificacion.create(
        {
          id: randomUUID(),
          usuario: boleto.jugadorDetalles.usuario,
          tipo: 'Premio',
          asunto: '¡Felicidades! Has ganado un premio',
          mensaje: `Has ganado L${montoGanado.toFixed(2)} en el sorteo del ${sorteo.fecha} a las ${sorteo.hora}. El número ganador fue ${numeroGanador}.`,
          leida: false,
          enviada: false,
          referencia: boleto.id,
          metadata: { sorteo_id: sorteo.id, monto_ganado: montoGanado, numero_ganador: numeroGanador },
        },
        { transaction },
      );

      totalPremios += montoGanado;

      ganadores.push({ jugador: boleto.jugadorDetalles, boleto: boleto, montoGanado: montoGanado });
    }

    await sorteo.update({ total_premios: totalPremios }, { transaction });

    await transaction.commit();

    process.nextTick(async () => {
      for (const { jugador, boleto, montoGanado } of ganadores) {
        try {
          await correoPremioGanado(
            jugador.usuarioDetalles.correo,
            jugador.nombre,
            numeroGanador,
            montoGanado,
            sorteo.fecha,
            sorteo.hora,
          );

          await Notificacion.update({ enviada: true }, { where: { referencia: boleto.id, tipo: 'Premio' } });
        } catch (error) {
          console.error(`Error al enviar correo de premio a ${jugador.usuarioDetalles.correo}:`, error.message);
        }
      }

      const todosLosBoletos = await Boleto.findAll({
        where: { sorteo: sorteoId },
        include: [{ model: Jugador, as: 'jugadorDetalles', include: [{ model: Usuario, as: 'usuarioDetalles' }] }],
      });

      const participantesUnicos = new Map();
      for (const boleto of todosLosBoletos) {
        const correo = boleto.jugadorDetalles.usuarioDetalles.correo;
        if (!participantesUnicos.has(correo)) {
          participantesUnicos.set(correo, boleto.jugadorDetalles);
        }
      }

      for (const [correo, jugador] of participantesUnicos) {
        try {
          await correoResultadoSorteo(correo, jugador.nombre, numeroGanador, sorteo.fecha, sorteo.hora);
        } catch (error) {
          console.error(`Error al enviar correo de resultado a ${correo}:`, error.message);
        }
      }
    });

    console.log(`Sorteo ${sorteo.id} ejecutado exitosamente`);
    console.log(`Número ganador: ${numeroGanador}`);
    console.log(`Boletos ganadores: ${boletosGanadores.length}`);
    console.log(`Total premios: L${totalPremios.toFixed(2)}`);

    return {
      success: true,
      sorteo: sorteo,
      numeroGanador: numeroGanador,
      boletosGanadores: boletosGanadores.length,
      totalPremios: totalPremios,
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error al ejecutar sorteo:');
    console.error(error.message);
    throw error;
  }
};

export const ejecutarSorteosAutomaticos = async () => {
  try {
    const ahora = new Date();

    const sorteosParaEjecutar = await Sorteo.findAll({
      where: { estado: 'Cerrado', fecha_sorteo: { [Op.lte]: ahora } },
    });

    for (const sorteo of sorteosParaEjecutar) {
      try {
        await ejecutarSorteo(sorteo.id);
      } catch (error) {
        console.error(`Error al ejecutar sorteo ${sorteo.id}:`, error.message);
      }
    }

    return sorteosParaEjecutar.length;
  } catch (error) {
    console.error('Error al ejecutar sorteos automáticos:');
    console.error(error.message);
    return 0;
  }
};

export const iniciarEjecucionAutomatica = () => {
  setInterval(ejecutarSorteosAutomaticos, 60 * 1000);

  console.log('Sistema de ejecución automática de sorteos iniciado');
};
