import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const ingresar = async (request, response) => {
  const { correo, contrasena } = request.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return response.status(401).send({ mensaje: "" });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!contrasenaValida) {
      return response.status(401).send({ mensaje: "" });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    response.send({ mensaje: "", token });
  } catch (error) {
    console.error("");
    console.error(error);
    response.status(500).send({ mensaje: "" });
  }
};
