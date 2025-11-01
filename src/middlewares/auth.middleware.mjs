import jwt from 'jsonwebtoken';
import { Usuario } from '../modelos/index.mjs';

export const autenticar = async (request, response, next) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return response.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

    if (!usuario) {
      return response.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.estado !== 'Activo') {
      return response.status(403).json({ error: 'Usuario inactivo' });
    }

    request.usuario = { id: usuario.id, correo: usuario.correo, rol: usuario.rol };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ error: 'Token expirado' });
    }
    console.error(error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verificarAdministrador = (request, response, next) => {
  if (request.usuario.rol !== 'Administrador') {
    return response.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador' });
  }
  return next();
};

export const verificarVendedor = (request, response, next) => {
  if (request.usuario.rol !== 'Vendedor') {
    return response.status(403).json({ error: 'Acceso denegado. Se requiere rol de Vendedor' });
  }
  return next();
};

export const verificarAdminOVendedor = (request, response, next) => {
  if (request.usuario.rol !== 'Administrador' && request.usuario.rol !== 'Vendedor') {
    return response.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador o Vendedor' });
  }
  return next();
};
