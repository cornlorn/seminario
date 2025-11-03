import { baseEmailTemplate, escapeHtml } from './base.template.js';

/**
 * Password reset request email template
 * @param {string} codigo - Verification code
 * @returns {string} - HTML email
 */
export const plantillaSolicitud = (codigo) => {
  const appName = escapeHtml(process.env.APP_NAME || 'Lotería');
  const codigoSeguro = escapeHtml(codigo);

  const content = `
    <p>
      Recibimos una solicitud para recuperar tu cuenta. Usa el siguiente
      código de verificación para restablecer tu contraseña:
    </p>

    <div class="code-box">
      <div class="code-value" style="color: #ff6b35;">${codigoSeguro}</div>
      <p style="margin-top: 15px; font-size: 13px; color: #9ca3af;">Este código expira en 15 minutos</p>
    </div>

    <div class="alert-box">
      <p>
        <strong>¿No solicitaste este código?</strong><br />
        Si no realizaste esta solicitud, ignora este correo y tu cuenta
        permanecerá segura. Considera cambiar tu contraseña si crees que
        alguien está intentando acceder a tu cuenta.
      </p>
    </div>

    <div style="margin: 30px 0; padding: 25px; background-color: #f0f9ff; border: 1px solid #bae6fd;">
      <h3 style="font-size: 16px; color: #0c4a6e; margin-bottom: 15px; font-weight: 600;">Consejos de seguridad</h3>
      <ul style="color: #075985; font-size: 14px; margin-left: 20px;">
        <li>No compartas este código con nadie</li>
        <li>Nuestro equipo nunca te pedirá este código por teléfono o correo</li>
        <li>El código solo es válido por 15 minutos</li>
        <li>Puedes solicitar un nuevo código si este expira</li>
      </ul>
    </div>

    <p>
      Si necesitas ayuda o tienes alguna pregunta, contacta a nuestro
      equipo de soporte.
    </p>

    <p style="margin-top: 30px">
      Saludos,<br /><strong>El equipo de ${appName}</strong>
    </p>
  `;

  return baseEmailTemplate({
    title: `Recuperación de cuenta - ${appName}`,
    content,
    preheader: 'Código de recuperación de cuenta',
  });
};
