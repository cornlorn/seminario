import { base } from './index.mjs';

export const plantillaRecuperacion = (codigo) => {
  const contenido = `
  <h1>Recuperación de contraseña</h1>
  <p>
    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en ${process.env.APP_NAME}.
  </p>
  <p>
    Utiliza el siguiente código de verificación para completar el proceso de recuperación:
  </p>
  <div class="info-box" style="text-align: center;">
    <p style="margin-bottom: 15px; color: #1a1a1a; font-weight: 600;">
      Código de recuperación:
    </p>
    <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 32px; color: #ff6b35; font-weight: 700; letter-spacing: 8px; margin: 0;">
      ${codigo}
    </p>
  </div>
  <p style="color: #d97706; font-weight: 600;">
    Este código expirará en 15 minutos por seguridad.
  </p>
  <p>
    Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. 
    Tu contraseña actual permanecerá sin cambios.
  </p>
  <p style="margin-top: 30px">
    Si tienes problemas, contáctanos de inmediato.<br />
    <strong>El equipo de ${process.env.APP_NAME}</strong>
  </p>
  `;
  return base(contenido);
};
