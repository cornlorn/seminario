import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaDepositoSaldo } from './templates/deposit-balance.template.js';

export const correoDepositoSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Depósito realizado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaDepositoSaldo(nombre, monto, saldoNuevo, vendedor);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de depósito enviado');
};
