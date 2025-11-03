import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaCambioContrasena } from './templates/change-password.template.js';

export const correoCambioContrasena = async (destinatario) => {
  const asunto = 'Contraseña actualizada exitosamente';
  const plantilla = plantillaCambioContrasena();
  await enviarCorreo(destinatario, asunto, plantilla, '✓ Correo de cambio de contraseña enviado');
};
