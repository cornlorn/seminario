import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../modelos/index.mjs';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const ingresar = async (request, response) => {
  const { correo, contrasena } = request.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return response.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );
    if (!contrasenaValida) {
      return response.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
    );

    response
      .status(200)
      .json({ mensaje: 'Inicio de sesión exitoso', token: token });
  } catch (error) {
    console.error('Error: No se pudo iniciar sesión');
    console.error(error.message);
    response.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
