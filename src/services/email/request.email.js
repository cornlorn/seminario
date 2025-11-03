import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaSolicitud } from './templates/request.template.js';

export const correoSolicitud = async (destinatario, codigo) => {
  const asunto = 'Código de recuperación de cuenta';
  const plantilla = plantillaSolicitud(codigo);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de recuperación enviado');
};
