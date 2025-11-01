export const plantillaCambioContrasena = () => {
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Contraseña actualizada - ${process.env.APP_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #f5f5f5;
        padding: 40px 20px;
        line-height: 1.6;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
      }
      .header {
        background-color: #10b981;
        padding: 50px 40px;
        text-align: center;
        border-bottom: 1px solid #059669;
      }
      .logo {
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.5px;
        margin: 0;
      }
      .content { padding: 50px 40px; }
      h2 {
        font-size: 28px;
        color: #059669;
        margin-bottom: 20px;
        font-weight: 700;
        text-align: center;
      }
      p {
        color: #666666;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .success-icon {
        text-align: center;
        font-size: 64px;
        margin: 30px 0;
      }
      .success-box {
        margin: 35px 0;
        padding: 30px;
        background-color: #f0fdf4;
        border: 2px solid #86efac;
        text-align: center;
      }
      .success-message {
        font-size: 18px;
        color: #166534;
        font-weight: 600;
        margin-bottom: 0;
      }
      .info-box {
        margin: 30px 0;
        padding: 25px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
      }
      .info-box p {
        color: #4b5563;
        font-size: 15px;
        margin-bottom: 15px;
      }
      .info-box p:last-child { margin-bottom: 0; }
      .info-box strong { color: #1f2937; }
      .alert-box {
        margin: 30px 0;
        padding: 20px;
        background-color: #fef3c7;
        border-left: 4px solid #f59e0b;
      }
      .alert-box p {
        color: #92400e;
        font-size: 14px;
        margin-bottom: 0;
      }
      .security-tips {
        margin: 30px 0;
        padding: 25px;
        background-color: #f0f9ff;
        border: 1px solid #bae6fd;
      }
      .security-tips h3 {
        font-size: 16px;
        color: #0c4a6e;
        margin-bottom: 15px;
        font-weight: 600;
      }
      .security-tips ul {
        color: #075985;
        font-size: 14px;
        margin-left: 20px;
        margin-bottom: 0;
      }
      .security-tips ul li { margin-bottom: 10px; }
      .security-tips ul li:last-child { margin-bottom: 0; }
      .footer {
        padding: 30px 40px;
        background-color: #fafafa;
        text-align: center;
        border-top: 1px solid #e5e5e5;
      }
      .footer p {
        color: #999999;
        font-size: 13px;
        margin-bottom: 10px;
      }
      .divider {
        height: 1px;
        background-color: #e5e5e5;
        margin: 20px 0;
      }
      @media only screen and (max-width: 600px) {
        body { padding: 20px 10px; }
        .content, .header, .footer { padding: 30px 25px; }
        .logo { font-size: 28px; }
        .success-icon { font-size: 48px; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1 class="logo">${process.env.APP_NAME}</h1>
      </div>

      <div class="content">
        <div class="success-icon">✓</div>
        <h2>Contraseña actualizada</h2>

        <div class="success-box">
          <p class="success-message">Tu contraseña ha sido cambiada exitosamente</p>
        </div>

        <p>
          Tu contraseña se ha actualizado correctamente. Ya podés iniciar sesión con tu
          nueva contraseña en todos tus dispositivos.
        </p>

        <div class="info-box">
          <p>
            <strong>Fecha del cambio:</strong> ${new Date().toLocaleString('es-HN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
          <p>
            Si realizaste este cambio, no necesitás hacer nada más. Tu cuenta está segura.
          </p>
        </div>

        <div class="alert-box">
          <p>
            <strong>⚠️ ¿No fuiste vos?</strong><br />
            Si no realizaste este cambio, tu cuenta podría estar comprometida.
            Contactá inmediatamente a nuestro equipo de soporte para proteger tu cuenta.
          </p>
        </div>

        <div class="security-tips">
          <h3>💡 Consejos de seguridad</h3>
          <ul>
            <li>No compartas tu contraseña con nadie</li>
            <li>Usa una contraseña única y segura</li>
            <li>Cambiá tu contraseña periódicamente</li>
            <li>No uses la misma contraseña en múltiples sitios</li>
            <li>Cerrá sesión cuando uses computadoras públicas</li>
          </ul>
        </div>

        <p>
          Si tenés alguna pregunta o necesitás ayuda, no dudes en contactarnos.
        </p>

        <p style="margin-top: 30px">
          Saludos,<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
        </p>
      </div>

      <div class="footer">
        <p>© 2025 ${process.env.APP_NAME}. Todos los derechos reservados.</p>
        <div class="divider"></div>
        <p>Este es un correo automático de seguridad. Por favor no respondas a este mensaje.</p>
      </div>
    </div>
  </body>
</html>
`;
};
