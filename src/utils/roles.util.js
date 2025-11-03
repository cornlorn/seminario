import { ROLES } from '../constants/roles.constants.js';

/**
 * Middleware genérico para verificar roles
 * Elimina código repetitivo en los middlewares de autenticación
 *
 * @param {string[]} rolesPermitidos - Array de roles permitidos
 * @returns {Function} Middleware de Express
 */
export const verificarRoles = (rolesPermitidos) => {
  return (request, response, next) => {
    if (!request.usuario) {
      return response.status(401).json({ error: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(request.usuario.rol)) {
      const rolesTexto = rolesPermitidos.join(' o ');
      return response.status(403).json({ error: `Acceso denegado. Se requiere rol de ${rolesTexto}` });
    }

    return next();
  };
};

// Export convenience functions for common role checks
export const esAdmin = verificarRoles([ROLES.ADMIN]);
export const esVendedor = verificarRoles([ROLES.SELLER]);
export const esJugador = verificarRoles([ROLES.PLAYER]);
export const esAdminOVendedor = verificarRoles([ROLES.ADMIN, ROLES.SELLER]);
