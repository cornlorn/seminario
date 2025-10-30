import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.config.mjs';
import { Administrador } from '../modelos/index.mjs';
import { Usuario } from '../modelos/index.mjs';

const { ADMIN_USER, ADMIN_PASS, ADMIN_NAME, ADMIN_SURNAME } = process.env;

if (!ADMIN_USER || !ADMIN_PASS || !ADMIN_NAME || !ADMIN_SURNAME) {
  console.error('Error: Faltan variables de entorno para la cuenta de administrador por defecto');
  process.exit(1);
}

export const administrador = async () => {
  try {
    const [adminExistente, usuarioExistente] = await Promise.all([
      Usuario.findOne({ where: { rol: 'Administrador' } }),
      Usuario.findOne({ where: { correo: ADMIN_USER } }),
    ]);

    if (adminExistente) {
      console.log('Ya existe al menos un administrador en el sistema');
      return;
    }

    if (usuarioExistente) {
      console.log('El correo del administrador por defecto ya existe pero no es administrador');
      return;
    }

    await sequelize.transaction(async (transaccion) => {
      const usuarioUUID = crypto.randomUUID();

      await Usuario.create(
        { id: usuarioUUID, correo: ADMIN_USER, contrasena: await bcrypt.hash(ADMIN_PASS, 10), rol: 'Administrador' },
        { transaction: transaccion },
      );

      await Administrador.create(
        { id: crypto.randomUUID(), usuario: usuarioUUID, nombre: ADMIN_NAME, apellido: ADMIN_SURNAME },
        { transaction: transaccion },
      );
    });
  } catch (error) {
    console.error('Error: No se pudo crear el administrador por defecto');
    console.error(error.message);
  }
};
