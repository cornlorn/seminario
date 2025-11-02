import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaCambioContrasena } from './plantillas/cambio-contrasena.plantilla.mjs';

export const correoCambioContrasena = async (destinatario) => {
  const asunto = 'Contraseña actualizada exitosamente';
  const plantilla = plantillaCambioContrasena();

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`✓ Correo de cambio de contraseña enviado a ${destinatario}`);
    return true;
  } catch (error) {
    console.error(`✗ Error al enviar correo de cambio de contraseña a ${destinatario}:`);
    console.error(error.message);
    return false;
  }
};
