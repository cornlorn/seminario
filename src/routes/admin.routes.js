import { Router } from 'express';
import { crearUsuario } from '../controllers/create-user.controller.js';
import {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  listarVendedores,
} from '../controllers/admin-users.controller.js';
import {
  listarJuegos,
  crearJuego,
  actualizarJuego,
  listarSorteos,
  crearSorteo,
  actualizarSorteo,
  eliminarSorteo,
  obtenerEstadisticasSorteo,
} from '../controllers/admin-games.controller.js';
import { autenticar, verificarAdministrador } from '../middlewares/auth.middleware.js';
import { validar } from '../middlewares/validation.middleware.js';
import { validarCrearUsuario } from '../validations/create-user.validation.js';
import {
  validarActualizarUsuario,
  validarIdUsuario,
  validarListarUsuarios,
} from '../validations/admin-users.validation.js';
import {
  validarCrearJuego,
  validarActualizarJuego,
  validarCrearSorteo,
  validarActualizarSorteo,
  validarListarSorteos,
  validarIdParam,
} from '../validations/admin-games.validation.js';

const router = Router();

/**
 * @swagger
 * /admin/usuarios/crear:
 *   post:
 *     summary: Crea un nuevo usuario (Admin, Vendedor o Jugador)
 *     description: Permite al administrador crear cuentas de cualquier rol. La contraseña se genera automáticamente y se envía por correo
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - rol
 *               - nombre
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del nuevo usuario
 *               rol:
 *                 type: string
 *                 enum: [Administrador, Vendedor, Jugador]
 *                 description: Rol del nuevo usuario
 *               nombre:
 *                 type: string
 *                 description: Nombre (requerido para todos los roles)
 *               apellido:
 *                 type: string
 *                 description: Apellido (requerido para Vendedor y Jugador)
 *               telefono:
 *                 type: string
 *                 description: Teléfono (requerido para Vendedor y Jugador)
 *               direccion:
 *                 type: string
 *                 description: Dirección (opcional, solo para Vendedor)
 *               comision:
 *                 type: number
 *                 default: 2.0
 *                 description: Porcentaje de comisión (opcional, solo para Vendedor)
 *               saldo_inicial:
 *                 type: number
 *                 default: 0
 *                 description: Saldo inicial (opcional, solo para Jugador)
 *               nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento (opcional, solo para Jugador)
 *           examples:
 *             administrador:
 *               summary: Crear Administrador
 *               value:
 *                 correo: admin@correo.com
 *                 rol: Administrador
 *                 nombre: Carlos
 *             vendedor:
 *               summary: Crear Vendedor
 *               value:
 *                 correo: vendedor@correo.com
 *                 rol: Vendedor
 *                 nombre: María
 *                 apellido: González
 *                 telefono: "98765432"
 *                 direccion: "Punto de venta Centro, Tegucigalpa"
 *                 comision: 2.5
 *             jugador:
 *               summary: Crear Jugador
 *               value:
 *                 correo: jugador@correo.com
 *                 rol: Jugador
 *                 nombre: Pedro
 *                 apellido: López
 *                 telefono: "99887766"
 *                 saldo_inicial: 100
 *                 nacimiento: "1995-05-15"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       409:
 *         description: El correo ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuarios/crear', autenticar, verificarAdministrador, validarCrearUsuario, validar, crearUsuario);

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     summary: Lista todos los usuarios del sistema
 *     description: Obtiene la lista completa de usuarios con opciones de filtrado y paginación
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [Administrador, Vendedor, Jugador]
 *         description: Filtrar por rol
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activo, Inactivo]
 *         description: Filtrar por estado
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
 *         description: Lista de usuarios obtenida exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios', autenticar, verificarAdministrador, validarListarUsuarios, validar, listarUsuarios);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   get:
 *     summary: Obtiene los detalles de un usuario específico
 *     description: Retorna información completa del usuario incluyendo su perfil según rol
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/:id', autenticar, verificarAdministrador, validarIdUsuario, validar, obtenerUsuario);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   put:
 *     summary: Actualiza el estado de un usuario
 *     description: Permite activar o desactivar una cuenta de usuario
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Activo, Inactivo]
 *                 description: Nuevo estado del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error de validación o intento de desactivar cuenta propia
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/usuarios/:id', autenticar, verificarAdministrador, validarActualizarUsuario, validar, actualizarUsuario);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   delete:
 *     summary: Desactiva una cuenta de usuario
 *     description: Realiza un soft delete del usuario cambiando su estado a Inactivo
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       400:
 *         description: Intento de eliminar cuenta propia
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/usuarios/:id', autenticar, verificarAdministrador, validarIdUsuario, validar, eliminarUsuario);

/**
 * @swagger
 * /admin/vendedores:
 *   get:
 *     summary: Lista todos los vendedores del sistema
 *     description: Obtiene la lista completa de vendedores con sus estadísticas
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista de vendedores obtenida exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/vendedores', autenticar, verificarAdministrador, listarVendedores);

/**
 * @swagger
 * /admin/juegos:
 *   get:
 *     summary: Lista todos los juegos del sistema
 *     description: Obtiene la lista de juegos con sus modalidades
 *     tags:
 *       - Administración - Juegos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activo, Inactivo]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Juegos obtenidos exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/juegos', autenticar, verificarAdministrador, listarJuegos);

/**
 * @swagger
 * /admin/juegos:
 *   post:
 *     summary: Crea un nuevo juego
 *     description: Permite al administrador crear un nuevo juego de lotería
 *     tags:
 *       - Administración - Juegos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Diaria Premium"
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Nueva modalidad de juego diario con mayores premios"
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       409:
 *         description: Ya existe un juego con ese nombre
 *       500:
 *         description: Error interno del servidor
 */
router.post('/juegos', autenticar, verificarAdministrador, validarCrearJuego, validar, crearJuego);

/**
 * @swagger
 * /admin/juegos/{id}:
 *   put:
 *     summary: Actualiza un juego existente
 *     description: Permite al administrador actualizar la información de un juego
 *     tags:
 *       - Administración - Juegos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del juego
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *               estado:
 *                 type: string
 *                 enum: [Activo, Inactivo]
 *     responses:
 *       200:
 *         description: Juego actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Juego no encontrado
 *       409:
 *         description: Ya existe un juego con ese nombre
 *       500:
 *         description: Error interno del servidor
 */
router.put('/juegos/:id', autenticar, verificarAdministrador, validarActualizarJuego, validar, actualizarJuego);

/**
 * @swagger
 * /admin/sorteos:
 *   get:
 *     summary: Lista todos los sorteos con filtros
 *     description: Obtiene la lista de sorteos con opciones avanzadas de filtrado
 *     tags:
 *       - Administración - Sorteos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Pendiente, Abierto, Cerrado, Finalizado, Cancelado]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fecha_desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final (YYYY-MM-DD)
 *       - in: query
 *         name: modalidad
 *         schema:
 *           type: string
 *         description: ID de modalidad
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 100
 *           maximum: 200
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Sorteos obtenidos exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sorteos', autenticar, verificarAdministrador, validarListarSorteos, validar, listarSorteos);

/**
 * @swagger
 * /admin/sorteos:
 *   post:
 *     summary: Crea un nuevo sorteo
 *     description: Permite al administrador crear un sorteo para una modalidad específica
 *     tags:
 *       - Administración - Sorteos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modalidad_id
 *               - fecha
 *               - hora
 *             properties:
 *               modalidad_id:
 *                 type: string
 *                 example: "uuid-de-modalidad"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               hora:
 *                 type: string
 *                 example: "21:00:00"
 *     responses:
 *       201:
 *         description: Sorteo creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Modalidad no encontrada
 *       409:
 *         description: Ya existe un sorteo para esta modalidad, fecha y hora
 *       500:
 *         description: Error interno del servidor
 */
router.post('/sorteos', autenticar, verificarAdministrador, validarCrearSorteo, validar, crearSorteo);

/**
 * @swagger
 * /admin/sorteos/{id}:
 *   put:
 *     summary: Actualiza un sorteo existente
 *     description: Permite al administrador actualizar el estado o resultado de un sorteo
 *     tags:
 *       - Administración - Sorteos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Pendiente, Abierto, Cerrado, Finalizado, Cancelado]
 *               numero_ganador:
 *                 type: string
 *                 pattern: "^[0-9]{2}$"
 *                 example: "42"
 *     responses:
 *       200:
 *         description: Sorteo actualizado exitosamente
 *       400:
 *         description: Error de validación o transición de estado inválida
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Sorteo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/sorteos/:id', autenticar, verificarAdministrador, validarActualizarSorteo, validar, actualizarSorteo);

/**
 * @swagger
 * /admin/sorteos/{id}:
 *   delete:
 *     summary: Elimina un sorteo
 *     description: Elimina un sorteo solo si no tiene boletos vendidos
 *     tags:
 *       - Administración - Sorteos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Sorteo eliminado exitosamente
 *       400:
 *         description: No se puede eliminar un sorteo con boletos vendidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Sorteo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/sorteos/:id', autenticar, verificarAdministrador, validarIdParam, validar, eliminarSorteo);

/**
 * @swagger
 * /admin/sorteos/{id}/estadisticas:
 *   get:
 *     summary: Obtiene estadísticas detalladas de un sorteo
 *     description: Retorna información completa sobre boletos vendidos, números apostados y premios
 *     tags:
 *       - Administración - Sorteos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del sorteo
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (no es administrador)
 *       404:
 *         description: Sorteo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/sorteos/:id/estadisticas',
  autenticar,
  verificarAdministrador,
  validarIdParam,
  validar,
  obtenerEstadisticasSorteo,
);

export { router as rutasAdmin };
