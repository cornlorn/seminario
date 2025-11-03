import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaCompraBoleto } from './templates/buy-ticket.template.js';

export const correoCompraBoleto = async (destinatario, nombre, boletos, sorteo, total) => {
  const asunto = `Confirmación de compra - Sorteo del ${sorteo.fecha}`;
  const plantilla = plantillaCompraBoleto(nombre, boletos, sorteo, total);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de confirmación de compra enviado');
};
