import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const ingresarUsuario = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response
      .status(400)
      .json({ errores: errores.array().map((error) => error.msg) });
  }

  try {
    const { correo, contrasena } = request.body;

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return response
        .status(400)
        .json({ error: "Correo o contraseña incorrecta" });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      return response
        .status(400)
        .json({ error: "Correo o contraseña incorrecta" });
    }

    const respuesta = { id: usuario.id, correo: usuario.correo };

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return response
      .status(200)
      .json({ mensaje: "Inicio de sesión exitoso", usuario: respuesta, token });
  } catch (error) {
    console.error("Se produjo un error al ingresar usuario:", error);
    return response.status(500).json({ error: "Error interno del servidor" });
  }
};
