import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const solicitar = async (request, response) => {
  const { correo } = request.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return response.send({ mensaje: "" });
    }

    const codigo = Math.floor(Math.random() * 900000 + 100000).toString();

    usuario.recuperacion = codigo;
    await usuario.save();

    response.send({ mensaje: "", codigo });
  } catch (error) {
    console.error("");
    console.error(error);
    response.status(500).send({ mensaje: "" });
  }
};
