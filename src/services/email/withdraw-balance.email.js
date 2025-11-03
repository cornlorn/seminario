import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaRetiroSaldo } from './templates/withdraw-balance.template.js';

export const correoRetiroSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Retiro procesado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaRetiroSaldo(nombre, monto, saldoNuevo, vendedor);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de retiro enviado');
};
