import { enviarCorreo } from '../../utilidades/correo.utilidad.mjs';
import { plantillaCredencialesNuevaCuenta } from './plantillas/credenciales-cuenta.plantilla.mjs';

export const correoCredencialesNuevaCuenta = async (destinatario, contrasena, rol, nombre) => {
  const asunto = `Bienvenido a ${process.env.APP_NAME} - Tus credenciales de acceso`;
  const plantilla = plantillaCredencialesNuevaCuenta(nombre, destinatario, contrasena, rol);
  await enviarCorreo(destinatario, asunto, plantilla, 'Correo de credenciales enviado');
};
