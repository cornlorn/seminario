import bcrypt from "bcrypt";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const restablecer = async (request, response) => {
  const { codigo, contrasena } = request.body;

  try {
    const usuario = await Usuario.findOne({ where: { recuperacion: codigo } });

    if (!usuario) {
      return response.send({ mensaje: "" });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    usuario.contrasena = contrasenaEncriptada;
    usuario.recuperacion = null;
    await usuario.save();

    response.send({ mensaje: "" });
  } catch (error) {
    console.error("");
    console.error(error);
    response.status(500).send({ mensaje: "" });
  }
};
