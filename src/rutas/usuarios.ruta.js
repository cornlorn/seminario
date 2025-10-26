import { Router } from "express";
import { crearUsuario } from "../controladores/autenticacion/crear.controlador.js";
import { ingresar } from "../controladores/autenticacion/ingresar.controlador.js";
import { registrar } from "../controladores/autenticacion/registrar.controlador.js";
import { restablecer } from "../controladores/autenticacion/restablecer.controlador.js";
import { solicitar } from "../controladores/autenticacion/solicitar.controlador.js";
import {
    esAdministrador,
    soloRegistroCliente,
    verificarToken,
} from "../middlewares/autenticacion.middleware.js";
import {
    validarCreacionUsuario,
    validarIngreso,
    validarRegistro,
    validarRestablecimiento,
    validarSolicitud,
} from "../validadores/validadores.js";

const router = Router();

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     description: Permite a un usuario registrarse como cliente en el sistema
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *               - nombre
 *               - apellido
 *               - identidad
 *               - telefono
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: cliente@ejemplo.com
 *               contrasena:
 *                 type: string
 *                 minLength: 8
 *                 example: MiPassword123
 *                 description: Debe contener mayúscula, minúscula y número
 *               nombre:
 *                 type: string
 *                 maxLength: 50
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 maxLength: 50
 *                 example: Pérez
 *               identidad:
 *                 type: string
 *                 pattern: '^\d{13}$'
 *                 example: '0801199012345'
 *                 description: Número de identidad de 13 dígitos
 *               telefono:
 *                 type: string
 *                 pattern: '^\d{8}$'
 *                 example: '98765432'
 *                 description: Número de teléfono de 8 dígitos
 *               departamento:
 *                 type: integer
 *                 example: 1
 *               municipio:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente
 *       400:
 *         description: Errores de validación
 *       409:
 *         description: Correo o identidad ya registrados
 *       500:
 *         description: Error interno del servidor
 */
router.post("/registrar", soloRegistroCliente, validarRegistro, registrar);

/**
 * @swagger
 * /usuarios/ingresar:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve un token JWT. Envía notificación por email.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *               contrasena:
 *                 type: string
 *                 example: MiPassword123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post("/ingresar", validarIngreso, ingresar);

/**
 * @swagger
 * /usuarios/solicitar:
 *   post:
 *     summary: Solicitar código de recuperación
 *     description: Envía un código de 6 dígitos al correo para recuperar la contraseña
 *     tags:
 *       - Recuperación de Contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@ejemplo.com
 *     responses:
 *       200:
 *         description: Solicitud procesada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/solicitar", validarSolicitud, solicitar);

/**
 * @swagger
 * /usuarios/restablecer:
 *   post:
 *     summary: Restablecer contraseña
 *     description: Restablece la contraseña usando el código recibido por email
 *     tags:
 *       - Recuperación de Contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - contrasena
 *             properties:
 *               codigo:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: '123456'
 *               contrasena:
 *                 type: string
 *                 minLength: 8
 *                 example: NuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Código inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/restablecer", validarRestablecimiento, restablecer);

/**
 * @swagger
 * /usuarios/crear:
 *   post:
 *     summary: Crear usuario (Solo Administradores)
 *     description: Permite a un administrador crear cualquier tipo de usuario con contraseña generada automáticamente
 *     tags:
 *       - Gestión de Usuarios
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
 *               - permiso
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: nuevo@ejemplo.com
 *               permiso:
 *                 type: string
 *                 enum: [Administrador, Empleado, Cliente]
 *                 example: Empleado
 *               nombre:
 *                 type: string
 *                 example: María
 *               apellido:
 *                 type: string
 *                 example: López
 *               identidad:
 *                 type: string
 *                 example: '0501198098765'
 *               telefono:
 *                 type: string
 *                 example: '95551234'
 *               departamento:
 *                 type: integer
 *                 example: 1
 *               municipio:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Errores de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado - Solo administradores
 *       409:
 *         description: Correo o identidad ya registrados
 *       500:
 *         description: Error interno del servidor
 */
router.post("/crear", verificarToken, esAdministrador, validarCreacionUsuario, crearUsuario);

export { router as usuariosRutas };
