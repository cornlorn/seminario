import { ROLES } from '../constants/roles.constants.js';

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

export const esAdmin = verificarRoles([ROLES.ADMIN]);
export const esVendedor = verificarRoles([ROLES.SELLER]);
export const esJugador = verificarRoles([ROLES.PLAYER]);
export const esAdminOVendedor = verificarRoles([ROLES.ADMIN, ROLES.SELLER]);
