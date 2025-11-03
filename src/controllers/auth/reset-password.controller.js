import { Op } from 'sequelize';
import { Token } from '../../models/index.js';
import { Usuario } from '../../models/index.js';
import { correoRestablecimiento } from '../../services/email/reset-password.email.js';
import { hashearContrasena } from '../../utils/password.util.js';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const restablecer = async (request, response) => {
  const { codigo, contrasena } = request.body;

  try {
    const token = await Token.findOne({
      where: { codigo: codigo, tipo: 'Recuperacion', expira: { [Op.gt]: new Date() } },
    });

    if (!token) {
      return response.status(400).json({ mensaje: 'Código de recuperación inválido o expirado' });
    }

    const usuario = await Usuario.findByPk(token.usuario);
    if (!usuario) {
      return response.status(400).json({ mensaje: 'Usuario asociado no encontrado' });
    }

    usuario.contrasena = await hashearContrasena(contrasena);
    await usuario.save();

    await token.destroy().catch(() => {});

    await Token.destroy({ where: { usuario: usuario.id, tipo: 'Recuperacion' } }).catch(() => {});

    await correoRestablecimiento(usuario.correo);

    return response.json({ mensaje: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error: No se pudo procesar la solicitud de restablecimiento de contraseña');
    console.error(error);
    return response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
