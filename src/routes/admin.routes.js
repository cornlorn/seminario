import { Router } from 'express';
import { crearUsuario } from '../controllers/create-user.controller.js';
import { autenticar, verificarAdministrador } from '../middlewares/auth.middleware.js';
import { validar } from '../middlewares/validation.middleware.js';
import { validarCrearUsuario } from '../validations/create-user.validation.js';

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

export { router as rutasAdmin };
