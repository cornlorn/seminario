import { Usuario } from '../../models/index.js';
import { correoCambioContrasena } from '../../services/email/change-password.email.js';
import { compararContrasena, hashearContrasena } from '../../utils/password.util.js';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const cambiarContrasena = async (request, response) => {
  try {
    const { contrasena_actual, contrasena_nueva } = request.body;
    const usuarioId = request.usuario.id;

    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return response.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log(usuario);

    const contrasenaValida = await compararContrasena(contrasena_actual, usuario.contrasena);

    if (!contrasenaValida) {
      return response.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    const mismaNueva = await compararContrasena(contrasena_nueva, usuario.contrasena);

    if (mismaNueva) {
      return response.status(400).json({ mensaje: 'La nueva contraseña debe ser diferente a la actual' });
    }

    const contrasenaEncriptada = await hashearContrasena(contrasena_nueva);

    await usuario.update({ contrasena: contrasenaEncriptada });

    process.nextTick(async () => {
      try {
        await correoCambioContrasena(usuario.correo);
      } catch (error) {
        console.error('Error al enviar correo de cambio de contraseña:', error.message);
      }
    });

    console.log(`[Correo] Cambio de contraseña: ${usuario.correo}`);

    response.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error: No se pudo cambiar la contraseña');
    console.error(error);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
