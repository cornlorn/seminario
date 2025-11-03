import { sequelize } from '../../config/database.config.js';
import { Administrador, Usuario } from '../../models/index.js';
import { hashearContrasena } from '../../utils/password.util.js';

const { ADMIN_USER, ADMIN_PASS, ADMIN_NAME } = process.env;

if (!ADMIN_USER || !ADMIN_PASS || !ADMIN_NAME) {
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
        { id: usuarioUUID, correo: ADMIN_USER, contrasena: await hashearContrasena(ADMIN_PASS), rol: 'Administrador' },
        { transaction: transaccion },
      );

      await Administrador.create(
        { id: crypto.randomUUID(), usuario: usuarioUUID, nombre: ADMIN_NAME },
        { transaction: transaccion },
      );
    });
  } catch (error) {
    console.error('Error: No se pudo crear el administrador por defecto');
    console.error(error.message);
  }
};
