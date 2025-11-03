import { opciones, transportador } from '../config/email.config.js';

export const enviarCorreo = async (destinatario, asunto, plantilla, logMessage = 'Correo enviado') => {
  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`${logMessage} a ${destinatario}`);
  } catch (error) {
    console.error(`Error: No se pudo enviar el correo a ${destinatario}`);
    console.error(error.message);
  }
};
