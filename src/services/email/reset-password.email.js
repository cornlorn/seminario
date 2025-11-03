import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaRestablecimiento } from './templates/reset-password.template.js';

export const correoRestablecimiento = async (destinatario) => {
  const asunto = `Tu contraseña ha sido restablecida`;
  const plantilla = plantillaRestablecimiento();
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de confirmación de restablecimiento enviado');
};
