import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaResultadoSorteo } from './plantillas/resultado-sorteo.plantilla.mjs';

export const correoResultadoSorteo = async (destinatario, nombre, numeroGanador, fecha, hora) => {
  const asunto = `Resultados del sorteo del ${fecha} - Diaria`;
  const plantilla = plantillaResultadoSorteo(nombre, numeroGanador, fecha, hora);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de resultados enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de resultados');
    console.error(error.message);
  }
};
