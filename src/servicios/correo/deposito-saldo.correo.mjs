import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaDepositoSaldo } from './plantillas/deposito-saldo.plantilla.mjs';

export const correoDepositoSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Depósito realizado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaDepositoSaldo(nombre, monto, saldoNuevo, vendedor);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de depósito enviado');
};
