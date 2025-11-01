import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaCompraBoleto } from './plantillas/compra-boleto.plantilla.mjs';

export const correoCompraBoleto = async (destinatario, nombre, boletos, sorteo, total) => {
  const asunto = `Confirmación de compra - Sorteo del ${sorteo.fecha}`;
  const plantilla = plantillaCompraBoleto(nombre, boletos, sorteo, total);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de confirmación de compra enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de confirmación de compra');
    console.error(error.message);
  }
};
