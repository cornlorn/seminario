import nodemailer from 'nodemailer';

if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.APP_NAME
) {
  console.error('Error: Faltan variables de entorno para la configuración del correo');
  process.exit(1);
}

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, APP_NAME } = process.env;

export const transportador = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export const opciones = (destinatario, asunto, plantilla) => {
  return { from: `${APP_NAME} <${EMAIL_USER}>`, to: destinatario, subject: asunto, html: plantilla };
};
