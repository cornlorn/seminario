import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaSolicitud } from './plantillas/solicitud.plantilla.mjs';

export const correoSolicitud = async (destinatario, codigo) => {
  const asunto = 'Código de recuperación de cuenta';
  const plantilla = plantillaSolicitud(codigo);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de recuperación enviado');
};
