import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaSolicitud } from './plantillas/solicitud.plantilla.mjs';

export const correoSolicitud = async (destinatario, codigo) => {
  const asunto = 'Código de recuperación de cuenta';
  const plantilla = plantillaSolicitud(codigo);
  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de recuperación enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de recuperación');
    console.error(error.message);
  }
};
