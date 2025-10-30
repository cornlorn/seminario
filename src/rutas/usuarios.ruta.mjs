import { Router } from 'express';
import { ingresar } from '../controladores/auth/ingresar.controlador.mjs';
import { registrar } from '../controladores/auth/registrar.controlador.mjs';
import { restablecer } from '../controladores/auth/restablecer.controlador.mjs';
import { solicitar } from '../controladores/auth/solicitar.controlador.mjs';
import { validar } from '../middlewares/validacion.middleware.mjs';
import { validarIngreso } from '../validaciones/ingresar.validacion.mjs';
import { validarRegistro } from '../validaciones/registrar.validacion.mjs';
import { validarRestablecer } from '../validaciones/restablecer.validacion.mjs';
import { validarSolicitud } from '../validaciones/solicitar.validacion.mjs';

const router = Router();

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un usuario en la tabla `usuarios`, su perfil en `jugadores` y una billetera asociada en `billeteras`.
 *                  Todo se ejecuta dentro de una transacción para garantizar consistencia de datos.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       description: Datos necesarios para crear un nuevo usuario en el sistema
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
 *                 example: MiClaveSegura123
 *               nombre:
 *                 type: string
 *                 example: Pablo
 *               apellido:
 *                 type: string
 *                 example: Martínez
 *               telefono:
 *                 type: string
 *                 example: "+50498765432"
 *               nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-08-15"
 *     responses:
 *       201:
 *         description: El usuario fue creado correctamente junto con su jugador y billetera
 *       400:
 *         description: Los datos enviados no cumplen con las validaciones (ej. correo inválido, contraseña muy corta)
 *       409:
 *         description: El correo electrónico ya está registrado en el sistema
 *       500:
 *         description: Error inesperado en el servidor al intentar registrar al usuario
 */
router.post('/registrar', validarRegistro, validar, registrar);

/**
 * @swagger
 * /usuarios/ingresar:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     description: Valida las credenciales del usuario y devuelve un token JWT válido por 24 horas.
 *                  Este token debe usarse en el encabezado `Authorization` para acceder a rutas protegidas.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       description: Credenciales del usuario para iniciar sesión
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
 *                 example: MiClaveSegura123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
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
 *       400:
 *         description: Error de validación en los datos enviados
 *       401:
 *         description: Credenciales inválidas (correo no encontrado o contraseña incorrecta)
 *       500:
 *         description: Error inesperado en el servidor al intentar iniciar sesión
 */
router.post('/ingresar', validarIngreso, validar, ingresar);

/**
 * @swagger
 * /usuarios/solicitar:
 *   post:
 *     summary: Solicita un código de recuperación de contraseña
 *     description: Genera un código de recuperación válido por 15 minutos y lo asocia al usuario.
 *                  La respuesta siempre es genérica para no revelar si el correo existe o no en el sistema.
 *     tags:
 *       - Recuperación
 *     requestBody:
 *       required: true
 *       description: Correo electrónico del usuario que solicita la recuperación
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
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Solicitud procesada correctamente (si el correo existe, se envía un código de recuperación)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Si el correo existe, recibirás un código de recuperación
 *       400:
 *         description: Error de validación en el correo enviado
 *       500:
 *         description: Error inesperado en el servidor al procesar la solicitud
 */
router.post('/solicitar', validarSolicitud, validar, solicitar);

/**
 * @swagger
 * /usuarios/restablecer:
 *   post:
 *     summary: Restablece la contraseña de un usuario
 *     description: Valida un código de recuperación activo y actualiza la contraseña del usuario asociado.
 *                  El código expira a los 15 minutos de haber sido generado.
 *     tags:
 *       - Recuperación
 *     requestBody:
 *       required: true
 *       description: Código de recuperación válido y nueva contraseña
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
 *                 example: "123456"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: NuevaClaveSegura123
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Contraseña restablecida exitosamente
 *       400:
 *         description: Código inválido/expirado, usuario no encontrado o error de validación en los datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Código de recuperación inválido o expirado
 *       500:
 *         description: Error interno del servidor al procesar la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post('/restablecer', validarRestablecer, validar, restablecer);

export { router as rutasUsuarios };
