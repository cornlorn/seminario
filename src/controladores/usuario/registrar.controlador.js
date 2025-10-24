import { validationResult } from "express-validator";
import { sequelize } from "../../config/database.js";
import { Billetera } from "../../modelos/billetera.modelo.js";
import { Perfil } from "../../modelos/perfil.modelo.js";
import { Usuario } from "../../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const registrarUsuario = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response
      .status(400)
      .json({ errores: errores.array().map((error) => error.msg) });
  }

  const transaction = await sequelize.transaction();
  try {
    const {
      correo,
      contrasena,
      permiso,
      nombre,
      apellido,
      identidad,
      telefono,
      nacimiento,
    } = request.body;

    if (!permiso || permiso === "cliente") {
      const usuario = await Usuario.create(
        { correo, contrasena, permiso: "cliente" },
        { transaction },
      );

      await Perfil.create(
        {
          usuario: usuario.id,
          nombre,
          apellido,
          identidad,
          telefono,
          nacimiento,
        },
        { transaction },
      );
      await Billetera.create({ usuario: usuario.id }, { transaction });

      await transaction.commit();

      return response
        .status(201)
        .json({
          mensaje: "Usuario registrado exitosamente",
          usuario: { id: usuario.id, correo: usuario.correo },
        });
    }

    if (!request.usuario) {
      await transaction.rollback();
      return response
        .status(403)
        .json({ error: "No autorizado para asignar permisos" });
    }

    const solicitante = await Usuario.findByPk(request.usuario.id);
    if (!solicitante || solicitante.permiso !== "administrador") {
      await transaction.rollback();
      return response
        .status(403)
        .json({ error: "No autorizado para asignar permisos" });
    }

    const usuario = await Usuario.create(
      { correo, contrasena, permiso },
      { transaction },
    );

    await Perfil.create(
      {
        usuario: usuario.id,
        nombre,
        apellido,
        identidad,
        telefono,
        nacimiento,
      },
      { transaction },
    );
    await Billetera.create({ usuario: usuario.id }, { transaction });

    await transaction.commit();

    return response
      .status(201)
      .json({
        mensaje: "Usuario registrado exitosamente",
        usuario: { id: usuario.id, correo: usuario.correo },
      });
  } catch (error) {
    await transaction.rollback();
    console.error("Se produjo un error al registrar usuario:", error);
    return response.status(500).json({ error: "Error interno del servidor" });
  }
};
