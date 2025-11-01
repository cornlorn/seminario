import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaDepositoSaldo } from './plantillas/deposito-saldo.plantilla.mjs';

export const correoDepositoSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Depósito realizado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaDepositoSaldo(nombre, monto, saldoNuevo, vendedor);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de depósito enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de depósito');
    console.error(error.message);
  }
};
