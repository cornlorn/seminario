import { Router } from 'express';
import { ingresar } from '../controladores/auth/ingresar.controlador.mjs';
import { registrar } from '../controladores/auth/registrar.controlador.mjs';
import { validar } from '../middlewares/validacion.middleware.mjs';
import { validarIngreso } from '../validaciones/ingresar.validacion.mjs';
import { validarRegistro } from '../validaciones/registrar.validacion.mjs';

const router = Router();

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registra un nuevo usuario y crea su jugador y billetera asociada
 *     tags:
 *       - Usuarios
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
 *               - telefono
 *               - nacimiento
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: Contrasena2025
 *               nombre:
 *                 type: string
 *                 example: Andrea
 *               apellido:
 *                 type: string
 *                 example: Martínez
 *               telefono:
 *                 type: string
 *                 example: "98765432"
 *               nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-15"
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campo:
 *                         type: string
 *                         example: correo
 *                       mensaje:
 *                         type: string
 *                         example: El correo debe tener un formato válido
 *       409:
 *         description: El correo ya está registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/registrar', validarRegistro, validar, registrar);

/**
 * @swagger
 * /usuarios/ingresar:
 *   post:
 *     summary: Autentica un usuario y retorna un token JWT
 *     tags:
 *       - Usuarios
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
 *                 example: usuario@correo.com
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: Contrasena2025
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Retorna token JWT y datos básicos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 624f1b2e3a...
 *                     correo:
 *                       type: string
 *                       example: usuario@correo.com
 *                     nombre:
 *                       type: string
 *                       example: Andrea
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campo:
 *                         type: string
 *                         example: correo
 *                       mensaje:
 *                         type: string
 *                         example: El correo es obligatorio
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario o contraseña incorrectos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/ingresar', validarIngreso, validar, ingresar);

export { router as rutasUsuarios };
