import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png'];
export const MIMETYPES_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png'];
export const TAMANO_MAXIMO = 1 * 1024 * 1024;

const almacenamiento = multer.diskStorage({
  destination: async (request, file, callback) => {
    try {
      const usuario = request.usuario;
      if (!usuario?.id) {
        return callback(new Error('Usuario no autenticado'), null);
      }

      const directorio = path.join(__dirname, '..', '..', 'public', 'usuarios', usuario.id.toString());

      await fs.mkdir(directorio, { recursive: true });
      callback(null, directorio);
    } catch (error) {
      callback(error, null);
    }
  },
  filename: async (request, file, callback) => {
    try {
      const usuario = request.usuario;
      const directorio = path.join(__dirname, '..', '..', 'public', 'usuarios', usuario.id.toString());

      const archivos = await fs.readdir(directorio).catch(() => []);
      const avatarAntiguo = archivos.find((file) => file.startsWith('avatar'));

      if (avatarAntiguo) {
        await fs.unlink(path.join(directorio, avatarAntiguo)).catch(() => {});
      }

      const extension = path.extname(file.originalname).toLowerCase();
      const timestamp = Date.now();

      callback(null, `avatar-${timestamp}${extension}`);
    } catch (error) {
      callback(error, null);
    }
  },
});

const filtro = (request, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (MIMETYPES_PERMITIDOS.includes(file.mimetype) && EXTENSIONES_PERMITIDAS.includes(extension)) {
    callback(null, true);
  } else {
    callback(new Error('Solo se permiten archivos JPG, JPEG, PNG'), false);
  }
};

export const upload = multer({
  storage: almacenamiento,
  fileFilter: filtro,
  limits: { fileSize: TAMANO_MAXIMO, files: 1 },
});
