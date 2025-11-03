import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaRetiroSaldo } from './plantillas/retiro-saldo.plantilla.mjs';

export const correoRetiroSaldo = async (destinatario, nombre, monto, saldoNuevo, vendedor) => {
  const asunto = `Retiro procesado - L${parseFloat(monto).toFixed(2)}`;
  const plantilla = plantillaRetiroSaldo(nombre, monto, saldoNuevo, vendedor);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de retiro enviado');
};
