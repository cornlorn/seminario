import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaResultadoSorteo } from './templates/draw-result.template.js';

export const correoResultadoSorteo = async (destinatario, nombre, numeroGanador, fecha, hora) => {
  const asunto = `Resultados del sorteo del ${fecha} - Diaria`;
  const plantilla = plantillaResultadoSorteo(nombre, numeroGanador, fecha, hora);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de resultados enviado');
};
