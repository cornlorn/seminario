import { transportador } from '../config/email.config.mjs';

export const correoBienvenida = async (correo, nombre) => {
  const opciones = { to: correo, subject: `¡Te damos la bienvenida ${nombre}!`, html: correoBienvenida };

  try {
    transportador.sendMail(opciones);
    console.log(`Correo de bienvenida enviado a: ${correo}`);
    return { exito: true };
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de bienvenida');
    console.error(error.message);
    return { exito: false, error: error.message };
  }
};
