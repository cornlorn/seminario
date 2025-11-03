import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaResultadoSorteo } from './plantillas/resultado-sorteo.plantilla.mjs';

export const correoResultadoSorteo = async (destinatario, nombre, numeroGanador, fecha, hora) => {
  const asunto = `Resultados del sorteo del ${fecha} - Diaria`;
  const plantilla = plantillaResultadoSorteo(nombre, numeroGanador, fecha, hora);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de resultados enviado');
};
