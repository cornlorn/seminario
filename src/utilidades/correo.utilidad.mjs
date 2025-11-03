import { opciones, transportador } from '../config/correo.config.mjs';

/**
 * Utilidad genérica para enviar correos electrónicos
 * Reduce código repetitivo en los servicios de correo
 *
 * @param {string} destinatario - Correo del destinatario
 * @param {string} asunto - Asunto del correo
 * @param {string} plantilla - HTML del correo
 * @param {string} logMessage - Mensaje personalizado para el log
 */
export const enviarCorreo = async (destinatario, asunto, plantilla, logMessage = 'Correo enviado') => {
  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`${logMessage} a ${destinatario}`);
  } catch (error) {
    console.error(`Error: No se pudo enviar el correo a ${destinatario}`);
    console.error(error.message);
  }
};
