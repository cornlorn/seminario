import bcrypt from "bcrypt";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const registrar = async (request, response) => {
  const { correo, contrasena } = request.body;

  try {
    const usuarioExistente = await Usuario.findOne({ where: { correo } });

    if (usuarioExistente) {
      return response.status(409).send({ mensaje: "" });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    const usuarioNuevo = await Usuario.create({
      correo,
      contrasena: contrasenaEncriptada,
    });

    response.status(201).send({
      mensaje: "",
      usuario: { id: usuarioNuevo.id, correo: usuarioNuevo.correo },
    });
  } catch (error) {
    console.error("");
    console.error(error);
    response.status(500).send({ mensaje: "" });
  }
};
