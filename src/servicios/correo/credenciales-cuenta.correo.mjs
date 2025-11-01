import { opciones, transportador } from '../../config/correo.config.mjs';
import { plantillaCredencialesNuevaCuenta } from './plantillas/credenciales-cuenta.plantilla.mjs';

export const correoCredencialesNuevaCuenta = async (destinatario, contrasena, rol, nombre) => {
  const asunto = `Bienvenido a ${process.env.APP_NAME} - Tus credenciales de acceso`;
  const plantilla = plantillaCredencialesNuevaCuenta(nombre, destinatario, contrasena, rol);

  try {
    await transportador.sendMail(opciones(destinatario, asunto, plantilla));
    console.log(`Correo de credenciales enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de credenciales');
    console.error(error.message);
  }
};
