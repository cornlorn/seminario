import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaPremioGanado } from './plantillas/premio-ganado.plantilla.mjs';

export const correoPremioGanado = async (destinatario, nombre, numeroGanador, montoGanado, fecha, hora) => {
  const asunto = `¡Felicidades! Has ganado L${parseFloat(montoGanado).toFixed(2)}`;
  const plantilla = plantillaPremioGanado(nombre, numeroGanador, montoGanado, fecha, hora);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de premio enviado');
};
