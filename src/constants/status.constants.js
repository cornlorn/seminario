/**
 * System status constants
 * Define all valid statuses for different entities
 */

// User and general entity statuses
export const USER_STATUS = { ACTIVE: 'Activo', INACTIVE: 'Inactivo' };

// Ticket statuses
export const TICKET_STATUS = {
  ACTIVE: 'Activo',
  WINNER: 'Ganador',
  LOSER: 'Perdedor',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
};

// Draw statuses
export const DRAW_STATUS = {
  PENDING: 'Pendiente',
  OPEN: 'Abierto',
  CLOSED: 'Cerrado',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

// Transaction types
export const TRANSACTION_TYPES = {
  PURCHASE: 'Compra',
  PRIZE: 'Premio',
  DEPOSIT: 'Deposito',
  WITHDRAWAL: 'Retiro',
  ADJUSTMENT: 'Ajuste',
};

// Notification types
export const NOTIFICATION_TYPES = { PURCHASE: 'Compra', RESULT: 'Resultado', PRIZE: 'Premio', SYSTEM: 'Sistema' };

/**
 * Get all valid user statuses
 */
export const VALID_USER_STATUSES = Object.values(USER_STATUS);

/**
 * Get all valid ticket statuses
 */
export const VALID_TICKET_STATUSES = Object.values(TICKET_STATUS);

/**
 * Get all valid draw statuses
 */
export const VALID_DRAW_STATUSES = Object.values(DRAW_STATUS);

/**
 * Get all valid transaction types
 */
export const VALID_TRANSACTION_TYPES = Object.values(TRANSACTION_TYPES);

/**
 * Get all valid notification types
 */
export const VALID_NOTIFICATION_TYPES = Object.values(NOTIFICATION_TYPES);

/**
 * Check if a user status is valid
 * @param {string} status - The status to validate
 * @returns {boolean} - True if the status is valid
 */
export const isValidUserStatus = (status) => VALID_USER_STATUSES.includes(status);

/**
 * Check if a ticket status is valid
 * @param {string} status - The status to validate
 * @returns {boolean} - True if the status is valid
 */
export const isValidTicketStatus = (status) => VALID_TICKET_STATUSES.includes(status);

/**
 * Check if a draw status is valid
 * @param {string} status - The status to validate
 * @returns {boolean} - True if the status is valid
 */
export const isValidDrawStatus = (status) => VALID_DRAW_STATUSES.includes(status);
