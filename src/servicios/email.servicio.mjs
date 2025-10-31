import { transportador } from '../config/correo.config.mjs';
import { plantillaBienvenida } from '../plantillas/bienvenida.plantilla.mjs';
import { plantillaRecuperacion } from '../plantillas/recuperacion.plantilla.mjs';
import { plantillaRestablecimiento } from '../plantillas/restablecimiento.plantilla.mjs';

export const correoBienvenida = async (correo, nombre) => {
  const opciones = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: `¡Te damos la bienvenida!`,
    html: plantillaBienvenida(nombre),
  };

  try {
    await transportador.sendMail(opciones);
    console.log(`Correo de bienvenida enviado a: ${correo}`);
    return { exito: true };
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de bienvenida');
    console.error(error.message);
    return { exito: false, error: error.message };
  }
};

export const correoRecuperacion = async (correo, codigo) => {
  const opciones = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Recuperación de contraseña',
    html: plantillaRecuperacion(codigo),
  };

  try {
    await transportador.sendMail(opciones);
    console.log(`Correo de recuperación enviado a: ${correo}`);
    return { exito: true };
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de recuperación');
    console.error(error.message);
    return { exito: false, error: error.message };
  }
};

export const correoRestablecimiento = async (correo) => {
  const opciones = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Contraseña actualizada exitosamente',
    html: plantillaRestablecimiento(),
  };

  try {
    await transportador.sendMail(opciones);
    console.log(`Correo de confirmación de restablecimiento enviado a: ${correo}`);
    return { exito: true };
  } catch (error) {
    console.error('Error: No se pudo enviar el correo de confirmación');
    console.error(error.message);
    return { exito: false, error: error.message };
  }
};
