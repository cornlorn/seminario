export const plantillaSolicitud = (codigo) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Recuperación de cuenta - TuLotería</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont,
          "Segoe UI", Roboto, sans-serif;
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

      .content {
        padding: 50px 40px;
      }

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

      .code-box {
        margin: 35px 0;
        padding: 30px;
        background-color: #f9fafb;
        border: 2px solid #e5e7eb;
        text-align: center;
      }

      .code-label {
        font-size: 14px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
        font-weight: 600;
      }

      .code {
        font-family: "IBM Plex Mono", monospace;
        font-size: 36px;
        font-weight: 600;
        color: #ff6b35;
        letter-spacing: 8px;
        user-select: all;
      }

      .code-info {
        margin-top: 15px;
        font-size: 13px;
        color: #9ca3af;
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
        body {
          padding: 20px 10px;
        }

        .content,
        .header,
        .footer {
          padding: 30px 25px;
        }

        .logo {
          font-size: 28px;
        }

        .code {
          font-size: 28px;
          letter-spacing: 5px;
        }

        .code-box {
          padding: 25px 15px;
        }

        .security-tips {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1 class="logo">${process.env.APP_NAME}</h1>
      </div>

      <div class="content">
        <p>
          Recibimos una solicitud para recuperar tu cuenta. Usa el siguiente
          código de verificación para restablecer tu contraseña:
        </p>

        <div class="code-box">
          <div class="code-label">Código de verificación</div>
          <div class="code">${codigo}</div>
          <div class="code-info">Este código expira en 15 minutos</div>
        </div>

        <div class="alert-box">
          <p>
            <strong>¿No solicitaste este código?</strong><br />
            Si no realizaste esta solicitud, ignora este correo y tu cuenta
            permanecerá segura. Considera cambiar tu contraseña si crees que
            alguien está intentando acceder a tu cuenta.
          </p>
        </div>

        <div class="security-tips">
          <h3>Consejos de seguridad</h3>
          <ul>
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
          Saludos,<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
        </p>
      </div>

      <div class="footer">
        <p>© 2025 ${process.env.APP_NAME}. Todos los derechos reservados.</p>
        <div class="divider"></div>
        <p>
          Este es un correo automático de seguridad. Por favor no respondas a
          este mensaje.
        </p>
      </div>
    </div>
  </body>
</html>
`;
