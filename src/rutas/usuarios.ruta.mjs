import { Router } from 'express';
import { cambiarContrasena } from '../controladores/auth/cambiar-contrasena.controlador.mjs';
import { ingresar } from '../controladores/auth/ingresar.controlador.mjs';
import { registrar } from '../controladores/auth/registrar.controlador.mjs';
import { restablecer } from '../controladores/auth/restablecer.controlador.mjs';
import { solicitar } from '../controladores/auth/solicitar.controlador.mjs';
import { actualizar } from '../controladores/avatar/actualizar.controlador.mjs';
import { eliminar } from '../controladores/avatar/eliminar.controller.mjs';
import { autenticar } from '../middlewares/auth.middleware.mjs';
import { manejarErroresMulter, subirAvatar } from '../middlewares/multer.middleware.mjs';
import { validar } from '../middlewares/validacion.middleware.mjs';
import { validarCambioContrasena } from '../validaciones/cambio-contrasena.validacion.mjs';
import { validarIngreso } from '../validaciones/ingresar.validacion.mjs';
import { validarRegistro } from '../validaciones/registrar.validacion.mjs';
import { validarRestablecimiento } from '../validaciones/restablecer.validacion.mjs';
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
 *                 example: Contasena2025
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
 *                 example: Contasena2025
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
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
 *                 example: Contrasena2026
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Código inválido/expirado, usuario no encontrado o error de validación en los datos
 *       500:
 *         description: Error interno del servidor al procesar la solicitud
 */
router.post('/restablecer', validarRestablecimiento, validar, restablecer);

/**
 * @swagger
 * /usuarios/cambiar-contrasena:
 *   put:
 *     summary: Cambia la contraseña del usuario autenticado
 *     description: Permite al usuario cambiar su contraseña proporcionando la contraseña actual y la nueva contraseña
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contrasena_actual
 *               - contrasena_nueva
 *               - confirmar_contrasena
 *             properties:
 *               contrasena_actual:
 *                 type: string
 *                 format: password
 *                 description: Contraseña actual del usuario
 *                 example: ContrasenaActual123
 *               contrasena_nueva:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña (mín. 8 caracteres, 1 mayúscula, 1 número)
 *                 example: NuevaContrasena456
 *               confirmar_contrasena:
 *                 type: string
 *                 format: password
 *                 description: Confirmación de la nueva contraseña
 *                 example: NuevaContrasena456
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Error de validación (contraseñas no coinciden, no cumple requisitos, etc.)
 *       401:
 *         description: Token inválido o contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/cambiar-contrasena', autenticar, validarCambioContrasena, validar, cambiarContrasena);

/**
 * @swagger
 * /usuarios/avatar:
 *   put:
 *     summary: Actualiza el avatar del usuario autenticado
 *     description: Permite al usuario subir o actualizar su foto de perfil. Solo se permiten archivos JPG, JPEG y PNG con un tamaño máximo de 1MB.
 *     tags:
 *       - Avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (JPG, JPEG, PNG - máx. 1MB)
 *     responses:
 *       200:
 *         description: Avatar actualizado exitosamente
 *       400:
 *         description: Error en el archivo (tamaño, formato o no proporcionado)
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error al guardar el avatar
 */
router.put('/avatar', autenticar, subirAvatar, manejarErroresMulter, actualizar);

/**
 * @swagger
 * /usuarios/avatar:
 *   delete:
 *     summary: Elimina el avatar del usuario autenticado
 *     description: Elimina la foto de perfil actual del usuario
 *     tags:
 *       - Avatar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar eliminado exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: No hay avatar para eliminar
 *       500:
 *         description: Error al eliminar el avatar
 */
router.delete('/avatar', autenticar, eliminar);

export { router as rutasUsuarios };
