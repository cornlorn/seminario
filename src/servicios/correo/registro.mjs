import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaRegistro } from './plantillas/registro.plantilla.mjs';

export const correoRegistro = async (destinatario, nombre) => {
  const asunto = `Gracias por registrarte, ${nombre}`;
  const plantilla = plantillaRegistro(nombre);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de registro enviado');
};
