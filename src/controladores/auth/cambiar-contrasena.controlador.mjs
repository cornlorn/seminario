import bcrypt from 'bcrypt';
import { Usuario } from '../../modelos/index.mjs';
import { correoCambioContrasena } from '../../servicios/correo/cambio-contrasena.correo.mjs';

/**
 * Cambia la contraseña del usuario autenticado
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const cambiarContrasena = async (request, response) => {
  try {
    const { contrasena_actual, contrasena_nueva } = request.body;
    const usuarioId = request.usuario.id;

    // Obtener usuario
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return response.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log(usuario);

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasena_actual, usuario.contrasena);

    if (!contrasenaValida) {
      return response.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    // Verificar que la nueva contraseña sea diferente
    const mismaNueva = await bcrypt.compare(contrasena_nueva, usuario.contrasena);

    if (mismaNueva) {
      return response.status(400).json({ mensaje: 'La nueva contraseña debe ser diferente a la actual' });
    }

    // Encriptar nueva contraseña
    const contrasenaEncriptada = await bcrypt.hash(contrasena_nueva, 10);

    // Actualizar contraseña
    await usuario.update({ contrasena: contrasenaEncriptada });

    // Enviar correo de confirmación de manera asíncrona
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
