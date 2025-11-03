import { enviarCorreo } from '../../utils/email.util.js';
import { plantillaRegistro } from './templates/registration.template.js';

export const correoRegistro = async (destinatario, nombre) => {
  const asunto = `Gracias por registrarte, ${nombre}`;
  const plantilla = plantillaRegistro(nombre);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de registro enviado');
};
