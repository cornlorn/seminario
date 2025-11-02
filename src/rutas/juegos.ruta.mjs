import { Router } from 'express';
import { comprarBoletos } from '../controladores/comprar-boletos.controlador.mjs';
import { misBoletos, misEstadisticas, misTransacciones } from '../controladores/historial.controlador.mjs';
import { listarSorteosDisponibles, obtenerSorteo } from '../controladores/listar-sorteos.controlador.mjs';
import { autenticar } from '../middlewares/auth.middleware.mjs';
import { validar } from '../middlewares/validacion.middleware.mjs';
import { validarCompraBoletos } from '../validaciones/comprar-boletos.validacion.mjs';

const router = Router();

/**
 * @swagger
 * /juegos/sorteos:
 *   get:
 *     summary: Lista los sorteos disponibles para comprar boletos
 *     description: Retorna todos los sorteos en estado "Abierto" que aún aceptan compras, ordenados por fecha
 *     tags:
 *       - Sorteos
 *     responses:
 *       200:
 *         description: Lista de sorteos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sorteos', listarSorteosDisponibles);

/**
 * @swagger
 * /juegos/sorteos/{id}:
 *   get:
 *     summary: Obtiene los detalles de un sorteo específico
 *     description: Retorna información detallada de un sorteo, incluyendo estadísticas y número ganador si ya fue sorteado
 *     tags:
 *       - Sorteos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Sorteo obtenido exitosamente
 *       404:
 *         description: Sorteo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sorteos/:id', obtenerSorteo);

/**
 * @swagger
 * /juegos/boletos/comprar:
 *   post:
 *     summary: Compra boletos para un sorteo
 *     description: Permite al jugador comprar entre 1 y 10 boletos para un sorteo específico. Se valida el saldo, los límites y se procesan las transacciones
 *     tags:
 *       - Boletos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sorteo_id
 *               - boletos
 *             properties:
 *               sorteo_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del sorteo para el cual se compran los boletos
 *               boletos:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 10
 *                 items:
 *                   type: object
 *                   required:
 *                     - numero
 *                     - monto
 *                   properties:
 *                     numero:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 99
 *                       description: Número del boleto (00-99)
 *                     monto:
 *                       type: number
 *                       minimum: 5
 *                       multipleOf: 5
 *                       description: Monto a apostar (múltiplo de 5)
 *           example:
 *             sorteo_id: "123e4567-e89b-12d3-a456-426614174000"
 *             boletos:
 *               - numero: 42
 *                 monto: 10
 *               - numero: 7
 *                 monto: 5
 *     responses:
 *       201:
 *         description: Boletos comprados exitosamente
 *       400:
 *         description: Error de validación (saldo insuficiente, límites excedidos, etc.)
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Sorteo o jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/boletos/comprar', autenticar, validarCompraBoletos, validar, comprarBoletos);

/**
 * @swagger
 * /juegos/boletos/mis-boletos:
 *   get:
 *     summary: Obtiene el historial de boletos del usuario
 *     description: Lista todos los boletos comprados por el usuario autenticado, con opción de filtrar por estado
 *     tags:
 *       - Historial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activo, Ganador, Perdedor, Expirado, Cancelado]
 *         description: Filtrar boletos por estado
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Historial de boletos obtenido exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/boletos/mis-boletos', autenticar, misBoletos);

/**
 * @swagger
 * /juegos/transacciones:
 *   get:
 *     summary: Obtiene el historial de transacciones del usuario
 *     description: Lista todas las transacciones del usuario autenticado (compras, premios, depósitos, retiros)
 *     tags:
 *       - Historial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Compra, Premio, Deposito, Retiro, Ajuste]
 *         description: Filtrar transacciones por tipo
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Historial de transacciones obtenido exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/transacciones', autenticar, misTransacciones);

/**
 * @swagger
 * /juegos/estadisticas:
 *   get:
 *     summary: Obtiene estadísticas generales del usuario
 *     description: Retorna un resumen con total de boletos, montos apostados/ganados, tasa de victoria y último premio
 *     tags:
 *       - Historial
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/estadisticas', autenticar, misEstadisticas);

export { router as rutasJuegos };
