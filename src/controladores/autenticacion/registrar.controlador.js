import bcrypt from "bcrypt";
import { sequelize } from "../../config/database.js";
import { Billetera } from "../../modelos/billetera.modelo.js";
import { Cliente } from "../../modelos/cliente.modelo.js";
import { Departamento } from "../../modelos/departamento.modelo.js";
import { Municipio } from "../../modelos/municipio.modelo.js";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const registrar = async (request, response) => {
    const { correo, contrasena, nombre, apellido, identidad, departamento, municipio } =
        request.body;

    const transaction = await sequelize.transaction();

    try {
        const usuarioExistente = await Usuario.findOne({ where: { correo }, transaction });

        if (usuarioExistente) {
            await transaction.rollback();
            return response
                .status(409)
                .send({ mensaje: "El correo electrónico ya está registrado" });
        }

        const identidadExistente = await Cliente.findOne({ where: { identidad }, transaction });

        if (identidadExistente) {
            await transaction.rollback();
            return response
                .status(409)
                .send({ mensaje: "El número de identidad ya está registrado" });
        }

        if (departamento) {
            const departamentoExiste = await Departamento.findByPk(departamento, { transaction });
            if (!departamentoExiste) {
                await transaction.rollback();
                return response
                    .status(400)
                    .send({ mensaje: "El departamento seleccionado no es válido" });
            }
        }

        if (municipio) {
            const municipioExiste = await Municipio.findOne({
                where: { id: municipio, ...(departamento && { departamento }) },
                transaction,
            });

            if (!municipioExiste) {
                await transaction.rollback();
                return response
                    .status(400)
                    .send({
                        mensaje:
                            "El municipio seleccionado no es válido o no pertenece al departamento",
                    });
            }
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const usuarioNuevo = await Usuario.create(
            { correo, contrasena: contrasenaEncriptada, permiso: "Cliente" },
            { transaction },
        );

        const clienteNuevo = await Cliente.create(
            {
                usuario: usuarioNuevo.id,
                nombre,
                apellido,
                identidad,
                departamento: departamento || null,
                municipio: municipio || null,
            },
            { transaction },
        );

        const billeteraNueva = await Billetera.create(
            { usuario: usuarioNuevo.id, saldo: 0.0 },
            { transaction },
        );

        await transaction.commit();

        response
            .status(201)
            .send({
                mensaje: "Cliente registrado exitosamente",
                usuario: {
                    id: usuarioNuevo.id,
                    correo: usuarioNuevo.correo,
                    permiso: usuarioNuevo.permiso,
                },
                cliente: {
                    id: clienteNuevo.id,
                    nombre: clienteNuevo.nombre,
                    apellido: clienteNuevo.apellido,
                    identidad: clienteNuevo.identidad,
                    departamento: clienteNuevo.departamento,
                    municipio: clienteNuevo.municipio,
                },
                billetera: { saldo: billeteraNueva.saldo },
            });
    } catch (error) {
        await transaction.rollback();

        console.error("Error al registrar cliente:");
        console.error(error);

        response
            .status(500)
            .send({ mensaje: "Error interno del servidor al registrar el cliente" });
    }
};
