import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaRetiroSaldo } from './plantillas/retiro-saldo.plantilla.mjs';

export const correoRetiroSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Retiro procesado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaRetiroSaldo(nombre, monto, saldoNuevo, vendedor);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de retiro enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de retiro');
    console.error(error.message);
  }
};
