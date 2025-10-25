import crypto from "node:crypto";
import { Usuario } from "../../modelos/relaciones.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const solicitar = async (request, response) => {
    const { correo } = request.body;

    try {
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            return response.send({
                mensaje: "Si el correo existe, recibirás un código de recuperación",
            });
        }

        const codigo = crypto.randomInt(100000, 999999).toString();

        const expiracion = new Date();
        expiracion.setMinutes(expiracion.getMinutes() + 15);

        usuario.recuperacion = codigo;
        usuario.expiracion = expiracion;
        await usuario.save();

        // 🔔 AQUÍ integrar servicio de email
        // await enviarCorreoRecuperacion(correo, codigo);

        const respuesta = { mensaje: "Si el correo existe, recibirás un código de recuperación" };

        if (process.env.NODE_ENV === "development") {
            respuesta.codigo = codigo;
            respuesta.expira = expiracion.toLocaleString("es-HN", {
                timeZone: "America/Tegucigalpa",
            });
            console.log(`Código de recuperación para ${correo}:`);
            console.log(`Código: ${codigo}`);
            console.log(`Expira: ${expiracion.toLocaleString("es-HN")}`);
        }

        response.send(respuesta);
    } catch (error) {
        console.error("Error al solicitar recuperación:");
        console.error(error);
        response.status(500).send({ mensaje: "Error al procesar la solicitud de recuperación" });
    }
};
