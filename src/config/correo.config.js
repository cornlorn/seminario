import nodemailer from "nodemailer";

export const transportador = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});

export const correo = async () => {
    try {
        await transportador.verify();
        console.log("Servidor de email configurado correctamente");
        return true;
    } catch (error) {
        console.error("Error al configurar el servidor de email:");
        console.error(error.message);
        return false;
    }
};

export const opcionesBaseEmail = {
    from: `"${process.env.EMAIL_FROM_NAME || "Sistema"}" <${process.env.EMAIL_FROM}>`,
};
