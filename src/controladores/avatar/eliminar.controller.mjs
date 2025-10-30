import fs from 'node:fs/promises';
import path from 'node:path';
import { Jugador } from '../../modelos/index.mjs';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const eliminar = async (request, response) => {
  try {
    const directorio = path.join(
      process.cwd(),
      'public',
      'usuarios',
      request.usuario.id.toString(),
    );

    const archivos = await fs.readdir(directorio).catch(() => []);
    const avatar = archivos.find((file) => file.startsWith('avatar'));

    if (!avatar) {
      return response
        .status(404)
        .json({ error: 'No hay avatar para eliminar' });
    }

    await fs.unlink(path.join(directorio, avatar));

    await Jugador.update(
      { avatar: null },
      { where: { usuario: request.usuario.id } },
    );

    response.status(200).json({ mensaje: 'Avatar eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar avatar:', error);
    response.status(500).json({ error: 'Error al eliminar el avatar' });
  }
};
