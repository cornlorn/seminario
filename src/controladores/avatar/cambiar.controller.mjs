import fs from 'node:fs/promises';
import { Jugador } from '../../modelos/index.mjs';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const cambiar = async (request, response) => {
  try {
    if (!request.file) {
      return response
        .status(400)
        .json({ error: 'No se proporcionó ningún archivo' });
    }

    const avatarPath = `/usuarios/${request.usuario.id}/${request.file.filename}`;

    await Jugador.update(
      { avatar: avatarPath },
      { where: { usuario: request.usuario.id } },
    );

    response
      .status(200)
      .json({
        mensaje: 'Avatar subido exitosamente',
        avatar: {
          url: avatarPath,
          filename: request.file.filename,
          size: request.file.size,
        },
      });
  } catch (error) {
    console.error('Error al subir avatar:', error);

    if (request.file?.path) {
      await fs.unlink(request.file.path).catch(() => {});
    }

    response.status(500).json({ error: 'Error al guardar el avatar' });
  }
};
