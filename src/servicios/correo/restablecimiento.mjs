import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaRestablecimiento } from './plantillas/restablecimiento.plantilla.mjs';

export const correoRestablecimiento = async (destinatario) => {
  const asunto = `Tu contraseña ha sido restablecida`;
  const plantilla = plantillaRestablecimiento();
  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de confirmación de restablecimiento enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de confirmación');
    console.error(error.message);
  }
};
