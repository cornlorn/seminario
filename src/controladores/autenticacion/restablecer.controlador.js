import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { Usuario } from "../../modelos/relaciones.js";
import { enviarConfirmacionRestablecimiento } from "../../servicios/correo.servicio.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const restablecer = async (request, response) => {
    const { codigo, contrasena } = request.body;

    try {
        const usuario = await Usuario.findOne({
            where: { recuperacion: codigo, expiracion: { [Op.gt]: new Date() } },
        });

        if (!usuario) {
            return response
                .status(400)
                .send({ mensaje: "Código de recuperación inválido o expirado" });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        usuario.contrasena = contrasenaEncriptada;
        usuario.recuperacion = null;
        usuario.expiracion = null;
        await usuario.save();

        console.log(`Contraseña restablecida para: ${usuario.correo}`);

        await enviarConfirmacionRestablecimiento(usuario.correo);

        response.send({ mensaje: "Contraseña restablecida exitosamente" });
    } catch (error) {
        console.error("Error al restablecer contraseña:");
        console.error(error);
        response.status(500).send({ mensaje: "Error al restablecer la contraseña" });
    }
};
