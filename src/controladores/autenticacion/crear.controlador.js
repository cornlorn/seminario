import bcrypt from 'bcrypt';
import { sequelize } from '../../config/database.js';
import { Billetera } from '../../modelos/billetera.modelo.js';
import { Cliente } from '../../modelos/cliente.modelo.js';
import { Departamento } from '../../modelos/departamento.modelo.js';
import { Municipio } from '../../modelos/municipio.modelo.js';
import { Usuario } from '../../modelos/usuario.modelo.js';
import { enviarCredencialesNuevaCuenta } from '../../servicios/correo.servicio.js';

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
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const crearUsuario = async (request, response) => {
  const {
    correo,
    permiso,
    nombre,
    apellido,
    identidad,
    telefono,
    departamento,
    municipio,
  } = request.body;

  const transaction = await sequelize.transaction();

  try {
    const usuarioExistente = await Usuario.findOne({
      where: { correo },
      transaction,
    });

    if (usuarioExistente) {
      await transaction.rollback();
      return response
        .status(409)
        .json({ mensaje: 'El correo electrónico ya está registrado' });
    }

    if (permiso === 'Cliente') {
      if (!identidad) {
        await transaction.rollback();
        return response
          .status(400)
          .json({
            mensaje: 'El número de identidad es requerido para clientes',
          });
      }

      if (!telefono) {
        await transaction.rollback();
        return response
          .status(400)
          .json({ mensaje: 'El teléfono es requerido para clientes' });
      }

      const identidadExistente = await Cliente.findOne({
        where: { identidad },
        transaction,
      });

      if (identidadExistente) {
        await transaction.rollback();
        return response
          .status(409)
          .json({ mensaje: 'El número de identidad ya está registrado' });
      }

      if (departamento) {
        const departamentoExiste = await Departamento.findByPk(departamento, {
          transaction,
        });
        if (!departamentoExiste) {
          await transaction.rollback();
          return response
            .status(400)
            .json({ mensaje: 'El departamento seleccionado no es válido' });
        }
      }

      if (municipio) {
        const municipioExiste = await Municipio.findOne({
          where: { id: municipio, ...(departamento && { departamento }) },
          transaction,
        });

        if (!municipioExiste) {
          await transaction.rollback();
          return response
            .status(400)
            .json({
              mensaje:
                'El municipio seleccionado no es válido o no pertenece al departamento',
            });
        }
      }
    }

    const contrasenaGenerada = generarContrasena();
    const contrasenaEncriptada = await bcrypt.hash(contrasenaGenerada, 10);

    const usuarioNuevo = await Usuario.create(
      { correo, contrasena: contrasenaEncriptada, permiso },
      { transaction },
    );

    const respuesta = {
      mensaje: `Usuario ${permiso.toLowerCase()} creado exitosamente`,
      usuario: {
        id: usuarioNuevo.id,
        correo: usuarioNuevo.correo,
        permiso: usuarioNuevo.permiso,
        contrasenaGenerada,
      },
    };

    if (permiso === 'Cliente') {
      const clienteNuevo = await Cliente.create(
        {
          usuario: usuarioNuevo.id,
          nombre,
          apellido,
          identidad,
          telefono,
          departamento: departamento || null,
          municipio: municipio || null,
        },
        { transaction },
      );

      const billeteraNueva = await Billetera.create(
        { usuario: usuarioNuevo.id, saldo: 0.0 },
        { transaction },
      );

      respuesta.cliente = {
        id: clienteNuevo.id,
        nombre: clienteNuevo.nombre,
        apellido: clienteNuevo.apellido,
        identidad: clienteNuevo.identidad,
        telefono: clienteNuevo.telefono,
        departamento: clienteNuevo.departamento,
        municipio: clienteNuevo.municipio,
      };

      respuesta.billetera = { saldo: billeteraNueva.saldo };
    }

    await transaction.commit();

    console.log(`Usuario creado por admin:`);
    console.log(`Tipo: ${permiso}`);
    console.log(`Correo: ${correo}`);
    console.log(`Contraseña: ${contrasenaGenerada}`);

    await enviarCredencialesNuevaCuenta(correo, contrasenaGenerada, permiso);

    response.status(201).json(respuesta);
  } catch (error) {
    await transaction.rollback();

    console.error('Error al crear usuario:');
    console.error(error);

    response
      .status(500)
      .json({ mensaje: 'Error interno del servidor al crear el usuario' });
  }
};
