import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaPremioGanado } from './plantillas/premio-ganado.plantilla.mjs';

export const correoPremioGanado = async (destinatario, nombre, numeroGanador, montoGanado, fecha, hora) => {
  const asunto = `¡Felicidades! Has ganado L${parseFloat(montoGanado).toFixed(2)}`;
  const plantilla = plantillaPremioGanado(nombre, numeroGanador, montoGanado, fecha, hora);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de premio enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de premio');
    console.error(error.message);
  }
};
