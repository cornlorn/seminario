import { opcionesBaseEmail, transportador } from "../config/correo.config.js";
import {
    plantillaBienvenidaCliente,
    plantillaCodigoRecuperacion,
    plantillaContrasenaRestablecida,
    plantillaCuentaCreada,
} from "./plantillas.correo.js";

/**
 * @param {string} correo
 * @param {string} codigo
 * @param {Date} expiracion
 */
export const enviarCodigoRecuperacion = async (correo, codigo, expiracion) => {
    try {
        const expiracionFormateada = expiracion.toLocaleString("es-HN", {
            timeZone: "America/Tegucigalpa",
            dateStyle: "short",
            timeStyle: "short",
        });

        const opciones = {
            ...opcionesBaseEmail,
            to: correo,
            subject: "Código de Recuperación de Contraseña",
            html: plantillaCodigoRecuperacion(codigo, expiracionFormateada),
        };

        await transportador.sendMail(opciones);
        console.log(`Código de recuperación enviado a: ${correo}`);
        return { exito: true };
    } catch (error) {
        console.error(`Error al enviar código de recuperación a ${correo}:`);
        console.error(error);
        return { exito: false, error: error.message };
    }
};

/**
 * @param {string} correo
 * @param {string} contrasena
 * @param {string} permiso
 */
export const enviarCredencialesNuevaCuenta = async (correo, contrasena, permiso) => {
    try {
        const opciones = {
            ...opcionesBaseEmail,
            to: correo,
            subject: "Tu cuenta ha sido creada - Credenciales de acceso",
            html: plantillaCuentaCreada(correo, contrasena, permiso),
        };

        await transportador.sendMail(opciones);
        console.log(`Credenciales enviadas a: ${correo}`);
        return { exito: true };
    } catch (error) {
        console.error(`Error al enviar credenciales a ${correo}:`);
        console.error(error);
        return { exito: false, error: error.message };
    }
};

/**
 * @param {string} correo
 * @param {string} nombre
 */
export const enviarBienvenidaCliente = async (correo, nombre) => {
    try {
        const opciones = {
            ...opcionesBaseEmail,
            to: correo,
            subject: `¡Bienvenido ${nombre}!`,
            html: plantillaBienvenidaCliente(nombre, correo),
        };

        await transportador.sendMail(opciones);
        console.log(`Email de bienvenida enviado a: ${correo}`);
        return { exito: true };
    } catch (error) {
        console.error(`Error al enviar bienvenida a ${correo}:`);
        console.error(error);
        return { exito: false, error: error.message };
    }
};

/**
 * @param {string} correo
 */
export const enviarConfirmacionRestablecimiento = async (correo) => {
    try {
        const opciones = {
            ...opcionesBaseEmail,
            to: correo,
            subject: "Contraseña Restablecida Exitosamente",
            html: plantillaContrasenaRestablecida(correo),
        };

        await transportador.sendMail(opciones);
        console.log(`Confirmación de restablecimiento enviada a: ${correo}`);
        return { exito: true };
    } catch (error) {
        console.error(`Error al enviar confirmación a ${correo}:`);
        console.error(error);
        return { exito: false, error: error.message };
    }
};
