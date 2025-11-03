import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaCambioContrasena } from './plantillas/cambio-contrasena.plantilla.mjs';

export const correoCambioContrasena = async (destinatario) => {
  const asunto = 'Contraseña actualizada exitosamente';
  const plantilla = plantillaCambioContrasena();
  await enviarCorreo(destinatario, asunto, plantilla, '✓ Correo de cambio de contraseña enviado');
};
