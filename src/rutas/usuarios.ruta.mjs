import { Router } from 'express';
import { registrar } from '../controladores/auth/registrar.controlador.mjs';

const router = Router();

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registra un nuevo usuario y crea su jugador y billetera asociada
 *     description: Crea un registro en las tablas `usuarios`, `jugadores` y `billeteras` dentro de una transacción.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Cliente registrado exitosamente
 *       409:
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: El correo electrónico ya está registrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Error interno del servidor
 */
router.post('/registrar', registrar);

export { router as rutasUsuarios };
