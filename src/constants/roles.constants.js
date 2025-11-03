/**
 * User roles constants
 * Define all valid user roles in the system
 */
export const ROLES = { ADMIN: 'Administrador', SELLER: 'Vendedor', PLAYER: 'Jugador' };

/**
 * Array of all valid roles
 */
export const VALID_ROLES = Object.values(ROLES);

/**
 * Check if a role is valid
 * @param {string} role - The role to validate
 * @returns {boolean} - True if the role is valid
 */
export const isValidRole = (role) => VALID_ROLES.includes(role);
