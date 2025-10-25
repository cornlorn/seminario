import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Billetera } from "../../modelos/billetera.modelo.js";
import { Cliente } from "../../modelos/cliente.modelo.js";
import { Departamento } from "../../modelos/departamento.modelo.js";
import { Municipio } from "../../modelos/municipio.modelo.js";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const ingresar = async (request, response) => {
    const { correo, contrasena } = request.body;

    try {
        const usuario = await Usuario.findOne({
            where: { correo },
            include: [
                {
                    model: Cliente,
                    as: "cliente",
                    include: [
                        {
                            model: Departamento,
                            as: "departamentoInfo",
                            attributes: ["id", "nombre", "codigo"],
                        },
                        {
                            model: Municipio,
                            as: "municipioInfo",
                            attributes: ["id", "nombre", "codigo"],
                        },
                    ],
                },
                { model: Billetera, as: "billetera", attributes: ["saldo"] },
            ],
        });

        if (!usuario) {
            return response.status(401).send({ mensaje: "Credenciales inválidas" });
        }

        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contrasenaValida) {
            return response.status(401).send({ mensaje: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo, permiso: usuario.permiso },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
        );

        const respuesta = {
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: { id: usuario.id, correo: usuario.correo, permiso: usuario.permiso },
        };

        if (usuario.permiso === "Cliente" && usuario.cliente) {
            respuesta.cliente = {
                id: usuario.cliente.id,
                nombre: usuario.cliente.nombre,
                apellido: usuario.cliente.apellido,
                identidad: usuario.cliente.identidad,
                departamento: usuario.cliente.departamentoInfo,
                municipio: usuario.cliente.municipioInfo,
            };

            respuesta.billetera = { saldo: usuario.billetera?.saldo || 0.0 };
        }

        response.send(respuesta);
    } catch (error) {
        console.error("Error al iniciar sesión:");
        console.error(error);
        response.status(500).send({ mensaje: "Error interno del servidor" });
    }
};
