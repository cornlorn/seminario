import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.config.mjs';
import { Administrador, Billetera, Jugador, Usuario, Vendedor } from '../modelos/index.mjs';
import { correoCredencialesNuevaCuenta } from '../servicios/correo/credenciales-cuenta.correo.mjs';

const generarContrasena = () => {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const especiales = '!@#$%&*';
  const todos = mayusculas + minusculas + numeros + especiales;

  let contrasena = '';
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += especiales[Math.floor(Math.random() * especiales.length)];

  for (let i = 4; i < 12; i++) {
    contrasena += todos[Math.floor(Math.random() * todos.length)];
  }

  return contrasena
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Crea un nuevo usuario (Admin, Vendedor o Jugador)
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const crearUsuario = async (request, response) => {
  const { correo, rol, nombre, apellido, telefono, direccion, comision, saldo_inicial } = request.body;

  const transaction = await sequelize.transaction();

  try {
    // Validar que el rol sea válido
    const rolesValidos = ['Administrador', 'Vendedor', 'Jugador'];
    if (!rolesValidos.includes(rol)) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'Rol inválido. Debe ser Administrador, Vendedor o Jugador' });
    }

    // Verificar que el correo no exista
    const usuarioExistente = await Usuario.findOne({ where: { correo }, transaction });

    if (usuarioExistente) {
      await transaction.rollback();
      return response.status(409).json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    // Validar campos requeridos según el rol
    if (rol === 'Administrador' && !nombre) {
      await transaction.rollback();
      return response.status(400).json({ mensaje: 'El nombre es requerido para administradores' });
    }

    if (rol === 'Vendedor') {
      if (!nombre || !apellido || !telefono) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: 'El nombre, apellido y teléfono son requeridos para vendedores' });
      }
    }

    if (rol === 'Jugador') {
      if (!nombre || !apellido || !telefono) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: 'El nombre, apellido y teléfono son requeridos para jugadores' });
      }
    }

    // Generar contraseña automática
    const contrasenaGenerada = generarContrasena();
    const contrasenaEncriptada = await bcrypt.hash(contrasenaGenerada, 10);

    // Crear usuario
    const usuarioNuevo = await Usuario.create(
      { id: crypto.randomUUID(), correo, contrasena: contrasenaEncriptada, rol },
      { transaction },
    );

    const respuesta = {
      mensaje: `Usuario ${rol.toLowerCase()} creado exitosamente`,
      usuario: {
        id: usuarioNuevo.id,
        correo: usuarioNuevo.correo,
        rol: usuarioNuevo.rol,
        contrasena_generada: contrasenaGenerada,
      },
    };

    // Crear perfil según el rol
    if (rol === 'Administrador') {
      const adminNuevo = await Administrador.create(
        { id: crypto.randomUUID(), usuario: usuarioNuevo.id, nombre },
        { transaction },
      );

      respuesta.perfil = { id: adminNuevo.id, nombre: adminNuevo.nombre };
    }

    if (rol === 'Vendedor') {
      const comisionPorcentaje = comision ? parseFloat(comision) : 2.0;

      if (comisionPorcentaje < 0 || comisionPorcentaje > 100) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: 'La comisión debe estar entre 0% y 100%' });
      }

      const vendedorNuevo = await Vendedor.create(
        {
          id: crypto.randomUUID(),
          usuario: usuarioNuevo.id,
          nombre,
          apellido,
          telefono,
          direccion: direccion || null,
          comision_porcentaje: comisionPorcentaje,
        },
        { transaction },
      );

      respuesta.perfil = {
        id: vendedorNuevo.id,
        nombre: vendedorNuevo.nombre,
        apellido: vendedorNuevo.apellido,
        telefono: vendedorNuevo.telefono,
        direccion: vendedorNuevo.direccion,
        comision_porcentaje: parseFloat(vendedorNuevo.comision_porcentaje),
      };
    }

    if (rol === 'Jugador') {
      const jugadorNuevo = await Jugador.create(
        {
          id: crypto.randomUUID(),
          usuario: usuarioNuevo.id,
          nombre,
          apellido,
          telefono,
          nacimiento: request.body.nacimiento || new Date('2000-01-01'), // Fecha por defecto
        },
        { transaction },
      );

      // Crear billetera con saldo inicial
      const saldoInicial = saldo_inicial ? parseFloat(saldo_inicial) : 0.0;

      if (saldoInicial < 0) {
        await transaction.rollback();
        return response.status(400).json({ mensaje: 'El saldo inicial no puede ser negativo' });
      }

      const billeteraNueva = await Billetera.create(
        { id: crypto.randomUUID(), jugador: jugadorNuevo.id, saldo: saldoInicial },
        { transaction },
      );

      respuesta.perfil = {
        id: jugadorNuevo.id,
        nombre: jugadorNuevo.nombre,
        apellido: jugadorNuevo.apellido,
        telefono: jugadorNuevo.telefono,
        saldo_inicial: parseFloat(billeteraNueva.saldo),
      };
    }

    await transaction.commit();

    // Enviar correo con credenciales
    process.nextTick(async () => {
      try {
        await correoCredencialesNuevaCuenta(correo, contrasenaGenerada, rol, nombre);
      } catch (error) {
        console.error('Error: No se pudo enviar el correo de credenciales');
        console.error(error);
      }
    });

    console.log(`Usuario creado por administrador:`);
    console.log(`Tipo: ${rol}`);
    console.log(`Correo: ${correo}`);
    console.log(`Contraseña: ${contrasenaGenerada}`);

    response.status(201).json(respuesta);
  } catch (error) {
    await transaction.rollback();

    console.error('Error al crear usuario:');
    console.error(error);

    response.status(500).json({ mensaje: 'Error interno del servidor al crear el usuario' });
  }
};
