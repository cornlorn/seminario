export const ROLES = { ADMIN: 'Administrador', SELLER: 'Vendedor', PLAYER: 'Jugador' };

export const VALID_ROLES = Object.values(ROLES);

/**
 * @param {string} role
 * @returns {boolean}
 */
export const isValidRole = (role) => VALID_ROLES.includes(role);
