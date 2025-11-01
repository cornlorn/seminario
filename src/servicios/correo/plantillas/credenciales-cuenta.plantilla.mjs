export const plantillaCredencialesNuevaCuenta = (nombre, correo, contrasena, rol) => {
  console.log({ nombre, correo, contrasena, rol });
  const escapeHtml = (text = '') => {
    if (typeof text !== 'string') return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const nombreSeguro = escapeHtml(nombre);
  const correoSeguro = escapeHtml(correo);
  const rolSeguro = escapeHtml(rol);

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Bienvenido a ${process.env.APP_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
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
        background-color: #ff6b35;
        padding: 50px 40px;
        text-align: center;
        border-bottom: 1px solid #e85a28;
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
        color: #1a1a1a;
        margin-bottom: 20px;
        font-weight: 600;
      }
      p {
        color: #666666;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .credentials-box {
        margin: 35px 0;
        padding: 30px;
        background-color: #f9fafb;
        border: 2px solid #e5e7eb;
      }
      .credential-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e5e7eb;
      }
      .credential-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .credential-label {
        font-size: 14px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      .credential-value {
        font-family: "IBM Plex Mono", monospace;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        background-color: #ffffff;
        padding: 10px 15px;
        border-radius: 4px;
        border: 1px solid #d1d5db;
        user-select: all;
      }
      .role-badge {
        display: inline-block;
        padding: 8px 16px;
        background-color: #dbeafe;
        color: #1e40af;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
      }
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
      .security-tips ul li {
        margin-bottom: 10px;
      }
      .security-tips ul li:last-child {
        margin-bottom: 0;
      }
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
        .credential-row { flex-direction: column; align-items: flex-start; }
        .credential-value { margin-top: 10px; width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1 class="logo">${process.env.APP_NAME}</h1>
      </div>

      <div class="content">
        <h2>Cuenta creada exitosamente</h2>
        
        <p>Hola ${nombreSeguro},</p>

        <p>
          Se ha creado una cuenta de <span class="role-badge">${rolSeguro}</span> para ti en 
          ${process.env.APP_NAME}. A continuación encontrarás tus credenciales de acceso:
        </p>

        <div class="credentials-box">
          <div class="credential-row">
            <span class="credential-label">Usuario (Correo)</span>
            <span class="credential-value">${correoSeguro}</span>
          </div>
          <div class="credential-row">
            <span class="credential-label">Contraseña temporal</span>
            <span class="credential-value">${escapeHtml(contrasena)}</span>
          </div>
        </div>

        <div class="alert-box">
          <p>
            <strong>⚠️ Importante:</strong> Por seguridad, te recomendamos cambiar esta contraseña 
            temporal en tu primer inicio de sesión.
          </p>
        </div>

        <div class="security-tips">
          <h3>Consejos de seguridad</h3>
          <ul>
            <li>No compartas tu contraseña con nadie</li>
            <li>Usa una contraseña única y segura</li>
            <li>Cierra sesión al terminar de usar el sistema</li>
            <li>No accedas desde computadoras públicas</li>
          </ul>
        </div>

        <p>
          Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al equipo de soporte.
        </p>

        <p style="margin-top: 30px">
          Saludos,<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
        </p>
      </div>

      <div class="footer">
        <p>© 2025 ${process.env.APP_NAME}. Todos los derechos reservados.</p>
        <div class="divider"></div>
        <p>Este es un correo automático. Por favor no respondas a este mensaje.</p>
      </div>
    </div>
  </body>
</html>
`;
};
