import multer from 'multer';
import { upload } from '../config/multer.config.mjs';

export const subirAvatar = upload.single('imagen');

export const manejarErroresMulter = (error, request, response, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return response
        .status(400)
        .json({ error: 'El archivo es demasiado grande. Tamaño máximo: 1MB' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return response
        .status(400)
        .json({ error: 'Solo puedes subir un archivo a la vez' });
    }
    return response
      .status(400)
      .json({ error: `Error al subir archivo: ${error.message}` });
  }

  if (error) {
    return response.status(400).json({ error: error.message });
  }

  next();
};
