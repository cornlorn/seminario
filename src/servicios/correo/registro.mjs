import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaRegistro } from './plantillas/registro.plantilla.mjs';

export const correoRegistro = async (destinatario, nombre) => {
  const asunto = `Gracias por registrarte, ${nombre} — empieza a explorar`;
  const plantilla = plantillaRegistro(nombre);
  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo');
    console.error(error.message);
  }
};
