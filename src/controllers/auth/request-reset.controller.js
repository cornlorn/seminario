import { randomUUID } from 'crypto';
import crypto from 'node:crypto';
import { Token, Usuario } from '../../models/index.js';
import { correoSolicitud } from '../../services/email/request.email.js';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const solicitar = async (request, response) => {
  const { correo } = request.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return response.send({ mensaje: 'Si el correo existe, recibirás un código de recuperación' });
    }

    const codigo = crypto.getRandomValues(new Uint32Array(1))[0].toString().padStart(6, '0').slice(0, 6);

    const expiracion = new Date();
    expiracion.setMinutes(expiracion.getMinutes() + 15);

    await Token.create({
      id: randomUUID(),
      usuario: usuario.id,
      tipo: 'Recuperacion',
      codigo: codigo,
      expira: expiracion,
    });

    await correoSolicitud(correo, codigo);

    response.json({ mensaje: 'Si el correo existe, recibirás un código de recuperación' });
  } catch (error) {
    console.error('[ERROR] No se pudo procesar la solicitud de recuperación');
    console.error(error);
    response.status(500).send({ mensaje: 'Error interno del servidor' });
  }
};
