import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaRestablecimiento } from './plantillas/restablecimiento.plantilla.mjs';

export const correoRestablecimiento = async (destinatario) => {
  const asunto = `Tu contraseña ha sido restablecida`;
  const plantilla = plantillaRestablecimiento();
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de confirmación de restablecimiento enviado');
};
