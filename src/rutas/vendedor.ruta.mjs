import { Router } from 'express';
import {
  agregarSaldo,
  buscarJugador,
  MONTOS_PREDETERMINADOS,
  misEstadisticasVendedor,
  misOperaciones,
  retirarSaldo,
} from '../controladores/gestionar-saldo.controlador.mjs';
import { autenticar, verificarVendedor } from '../middlewares/auth.middleware.mjs';
import { validar } from '../middlewares/validacion.middleware.mjs';
import {
  validarAgregarSaldo,
  validarBuscarJugador,
  validarRetirarSaldo,
} from '../validaciones/gestionar-saldo.validacion.mjs';

const router = Router();

/**
 * @swagger
 * /vendedor/montos-predeterminados:
 *   get:
 *     summary: Obtiene los montos predeterminados para recargas
 *     description: Retorna la lista de montos predeterminados que el vendedor puede usar para recargas rápidas
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de montos obtenida exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 */
router.get('/montos-predeterminados', autenticar, verificarVendedor, (request, response) => {
  response
    .status(200)
    .json({
      mensaje: 'Montos predeterminados obtenidos exitosamente',
      montos: MONTOS_PREDETERMINADOS,
      minimo: 25,
      maximo: 1000,
    });
});

/**
 * @swagger
 * /vendedor/buscar-jugador:
 *   get:
 *     summary: Busca un jugador por correo electrónico
 *     description: Permite al vendedor buscar información básica de un jugador antes de realizar una operación
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: correo
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Correo electrónico del jugador
 *     responses:
 *       200:
 *         description: Jugador encontrado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/buscar-jugador', autenticar, verificarVendedor, validarBuscarJugador, validar, buscarJugador);

/**
 * @swagger
 * /vendedor/agregar-saldo:
 *   post:
 *     summary: Agrega saldo a la cuenta de un jugador
 *     description: Permite al vendedor agregar saldo a la billetera de un jugador. Se registra la transacción y se calcula la comisión
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_jugador
 *               - monto
 *             properties:
 *               correo_jugador:
 *                 type: string
 *                 format: email
 *                 description: Correo del jugador
 *               monto:
 *                 type: number
 *                 minimum: 25
 *                 maximum: 1000
 *                 description: Monto a depositar (entre L25 y L1000)
 *           example:
 *             correo_jugador: jugador@correo.com
 *             monto: 100
 *     responses:
 *       200:
 *         description: Depósito realizado exitosamente
 *       400:
 *         description: Error de validación (monto fuera de rango, etc.)
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/agregar-saldo', autenticar, verificarVendedor, validarAgregarSaldo, validar, agregarSaldo);

/**
 * @swagger
 * /vendedor/retirar-saldo:
 *   post:
 *     summary: Retira saldo de la cuenta de un jugador
 *     description: Permite al vendedor retirar saldo de la billetera de un jugador (convertir saldo digital a efectivo)
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_jugador
 *               - monto
 *             properties:
 *               correo_jugador:
 *                 type: string
 *                 format: email
 *                 description: Correo del jugador
 *               monto:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 10000
 *                 description: Monto a retirar (máximo L10,000)
 *           example:
 *             correo_jugador: jugador@correo.com
 *             monto: 500
 *     responses:
 *       200:
 *         description: Retiro realizado exitosamente
 *       400:
 *         description: Error de validación (monto fuera de rango, saldo insuficiente, etc.)
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 *       404:
 *         description: Jugador no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/retirar-saldo', autenticar, verificarVendedor, validarRetirarSaldo, validar, retirarSaldo);

/**
 * @swagger
 * /vendedor/mis-operaciones:
 *   get:
 *     summary: Obtiene el historial de operaciones del vendedor
 *     description: Lista todas las operaciones (depósitos y retiros) realizadas por el vendedor autenticado
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Deposito, Retiro]
 *         description: Filtrar operaciones por tipo
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
 *         description: Historial obtenido exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 *       404:
 *         description: Vendedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/mis-operaciones', autenticar, verificarVendedor, misOperaciones);

/**
 * @swagger
 * /vendedor/mis-estadisticas:
 *   get:
 *     summary: Obtiene estadísticas del vendedor
 *     description: Retorna un resumen con total de depósitos, retiros y comisiones ganadas
 *     tags:
 *       - Vendedor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es vendedor)
 *       404:
 *         description: Vendedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/mis-estadisticas', autenticar, verificarVendedor, misEstadisticasVendedor);

export { router as rutasVendedor };
