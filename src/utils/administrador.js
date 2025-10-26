import bcrypt from "bcrypt";
import { Usuario } from "../modelos/usuario.modelo.js";

export const cuenta = async () => {
    try {
        const adminExistente = await Usuario.findOne({ where: { permiso: "Administrador" } });

        if (adminExistente) {
            console.log("Ya existe al menos un administrador en el sistema");
            return;
        }

        const correoAdmin = process.env.ADMIN_EMAIL;
        const contrasenaAdmin = process.env.ADMIN_PASSWORD;

        const usuarioExistente = await Usuario.findOne({ where: { correo: correoAdmin } });

        if (usuarioExistente) {
            console.log("El correo del admin por defecto ya existe pero no es administrador");
            return;
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasenaAdmin, 10);

        await Usuario.create({
            correo: correoAdmin,
            contrasena: contrasenaEncriptada,
            permiso: "Administrador",
        });
    } catch (error) {
        console.error("Error al inicializar administrador:");
        console.error(error);
    }
};
