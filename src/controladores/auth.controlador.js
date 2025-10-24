import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { sequelize } from "../config/database.js";
import { Billetera } from "../modelos/billetera.modelo.js";
import { Perfil } from "../modelos/perfil.modelo.js";
import { Usuario } from "../modelos/usuario.modelo.js";

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const registrar = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response
      .status(400)
      .json({ errores: errores.array().map((error) => error.msg) });
  }

  let { correo, contrasena, permiso } = request.body;
  let { nombre, apellido, identidad, telefono, nacimiento } = request.body;

  correo = correo?.trim().toLowerCase();
  permiso = permiso?.trim();
  nombre = nombre?.trim();
  apellido = apellido?.trim();
  identidad = identidad?.trim();
  telefono = telefono?.trim();

  try {
    const usuarioExistentePorCorreo = await Usuario.findOne({
      where: { correo },
    });
    if (usuarioExistentePorCorreo) {
      return response
        .status(409)
        .json({ mensaje: "El correo electrónico ya está registrado." });
    }

    const perfilExistentePorIdentidad = await Perfil.findOne({
      where: { identidad },
    });
    if (perfilExistentePorIdentidad) {
      return response
        .status(409)
        .json({ mensaje: "El número de identidad ya está registrado." });
    }

    const transaccion = await sequelize.transaction();

    try {
      if (permiso && permiso !== "Cliente" && !request.permiso) {
        await transaccion.rollback();
        return response
          .status(403)
          .json({ mensaje: "No tienes autorización para asignar permisos." });
      }

      const usuario = await Usuario.create(
        { correo, contrasena, permiso: permiso || "Cliente" },
        { transaction: transaccion },
      );

      if (!permiso || permiso === "Cliente") {
        await Perfil.create(
          {
            usuario: usuario.id,
            nombre,
            apellido,
            identidad,
            telefono,
            nacimiento,
          },
          { transaction: transaccion },
        );
      }

      if (!permiso || permiso === "Cliente") {
        await Billetera.create(
          { usuario: usuario.id, saldo: 0.0 },
          { transaction: transaccion },
        );
      }

      await transaccion.commit();

      return response
        .status(201)
        .json({
          mensaje: `${permiso || "Cliente"} creado exitosamente.`,
          usuario: {
            id: usuario.id,
            correo: usuario.correo,
            permiso: usuario.permiso,
          },
        });
    } catch (error) {
      await transaccion.rollback();
      console.error("Error en la transacción:", error);
      return response
        .status(500)
        .json({
          mensaje: "Error al registrar el usuario. Intenta nuevamente.",
        });
    }
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return response
      .status(500)
      .json({ mensaje: "Error interno del servidor." });
  }
};

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export const ingresar = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response
      .status(400)
      .json({ errores: errores.array().map((error) => error.msg) });
  }

  let { correo, contrasena } = request.body;

  correo = correo?.trim().toLowerCase();

  try {
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return response
        .status(401)
        .json({ mensaje: "Credenciales incorrectas." });
    }

    const contrasenaValida = await usuario.validarContrasena(contrasena);

    if (!contrasenaValida) {
      return response
        .status(401)
        .json({ mensaje: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, permiso: usuario.permiso },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return response
      .status(200)
      .json({
        mensaje: "Inicio de sesión exitoso.",
        usuario: {
          id: usuario.id,
          correo: usuario.correo,
          permiso: usuario.permiso,
        },
        token,
      });
  } catch (error) {
    console.error("Error: No se pudo iniciar sesión.");
    console.error(error);
    return response
      .status(500)
      .json({ mensaje: "Error interno del servidor." });
  }
};
