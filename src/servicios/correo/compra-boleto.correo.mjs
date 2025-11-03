import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaCompraBoleto } from './plantillas/compra-boleto.plantilla.mjs';

export const correoCompraBoleto = async (destinatario, nombre, boletos, sorteo, total) => {
  const asunto = `Confirmación de compra - Sorteo del ${sorteo.fecha}`;
  const plantilla = plantillaCompraBoleto(nombre, boletos, sorteo, total);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de confirmación de compra enviado');
};
