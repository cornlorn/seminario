import bcrypt from 'bcrypt';
import { Usuario } from '../modelos/usuario.modelo.mjs';
import { Administrador } from '../modelos/administrador.modelo.mjs';
import { sequelize } from '../configuraciones/database.mjs';

if (
  !process.env.ADMIN_USER ||
  !process.env.ADMIN_PASS ||
  !process.env.ADMIN_NAME ||
  !process.env.ADMIN_SURNAME
) {
  console.error(
    'Error: Faltan variables de entorno para la cuenta de administrador por defecto',
  );
  process.exit(1);
}

const { ADMIN_USER, ADMIN_PASS, ADMIN_NAME, ADMIN_SURNAME } = process.env;

export const administrador = async () => {
  try {
    const administradorExistente = await Usuario.findOne({
      where: { rol: 'Administrador' },
    });

    if (administradorExistente) {
      console.log('Ya existe al menos un administrador en el sistema');
      return;
    }

    const usuarioExistente = await Usuario.findOne({
      where: { correo: ADMIN_USER },
    });

    if (usuarioExistente) {
      console.log(
        'El correo del administrador por defecto ya existe pero no es administrador',
      );
      return;
    }

    const transaccion = await sequelize.transaction();

    try {
      const usuarioUUID = crypto.randomUUID();

      await Usuario.create(
        {
          id: usuarioUUID,
          correo: ADMIN_USER,
          contrasena: await bcrypt.hash(ADMIN_PASS, 10),
          rol: 'Administrador',
        },
        { transaction: transaccion },
      );

      await Administrador.create(
        {
          id: crypto.randomUUID(),
          usuario: usuarioUUID,
          nombre: ADMIN_NAME,
          apellido: ADMIN_SURNAME,
        },
        { transaction: transaccion },
      );

      await transaccion.commit();
    } catch (error) {
      await transaccion.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error: No se pudo crear el administrador por defecto');
    console.error(error.message);
  }
};
