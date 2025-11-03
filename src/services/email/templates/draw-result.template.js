export const plantillaResultadoSorteo = (nombre, numeroGanador, fecha, hora) => {
  const escapeHtml = (text) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const nombreSeguro = escapeHtml(nombre);

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Resultados del sorteo - ${process.env.APP_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

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

      .content {
        padding: 50px 40px;
      }

      h2 {
        font-size: 28px;
        color: #1a1a1a;
        margin-bottom: 20px;
        font-weight: 600;
        text-align: center;
      }

      p {
        color: #666666;
        font-size: 16px;
        margin-bottom: 20px;
      }

      .winner-box {
        margin: 40px 0;
        padding: 40px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 3px solid #f59e0b;
        text-align: center;
        border-radius: 8px;
      }

      .winner-label {
        font-size: 16px;
        color: #92400e;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        font-weight: 600;
      }

      .winner-number {
        font-family: "IBM Plex Mono", monospace;
        font-size: 72px;
        font-weight: 700;
        color: #b45309;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        letter-spacing: 8px;
      }

      .info-box {
        margin: 30px 0;
        padding: 25px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 15px;
      }

      .info-row:last-child {
        margin-bottom: 0;
      }

      .info-label {
        color: #6b7280;
        font-weight: 500;
      }

      .info-value {
        color: #1f2937;
        font-weight: 600;
      }

      .cta-button {
        display: inline-block;
        margin: 30px 0;
        padding: 15px 40px;
        background-color: #ff6b35;
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        border-radius: 6px;
        text-align: center;
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

        .content, .header, .footer {
          padding: 30px 25px;
        }

        .logo {
          font-size: 28px;
        }

        .winner-number {
          font-size: 56px;
          letter-spacing: 4px;
        }

        .winner-box {
          padding: 30px 20px;
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
        <h2>Resultados del sorteo</h2>
        
        <p>Hola ${nombreSeguro},</p>

        <p>
          El sorteo de <strong>Diaria</strong> ha finalizado. Aquí están los resultados oficiales:
        </p>

        <div class="winner-box">
          <div class="winner-label">Número ganador</div>
          <div class="winner-number">${numeroGanador}</div>
        </div>

        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Fecha del sorteo:</span>
            <span class="info-value">${fecha}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hora del sorteo:</span>
            <span class="info-value">${hora}</span>
          </div>
        </div>

        <p>
          Podés revisar tus boletos y premios en tu cuenta. Si resultaste ganador,
          el premio ya fue acreditado automáticamente a tu billetera.
        </p>

        <div style="text-align: center;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="cta-button">
            Ver mis boletos
          </a>
        </div>

        <p>
          ¿No ganaste esta vez? ¡No te preocupes! Tenemos sorteos todos los días a las
          11:00 AM, 3:00 PM y 9:00 PM. Tu próxima oportunidad está muy cerca.
        </p>

        <p style="margin-top: 30px">
          ¡Buena suerte en el próximo sorteo!<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
        </p>
      </div>

      <div class="footer">
        <p>© 2025 ${process.env.APP_NAME}. Todos los derechos reservados.</p>
        <div class="divider"></div>
        <p>
          Este es un correo automático. Por favor no respondas a este mensaje.
        </p>
      </div>
    </div>
  </body>
</html>
`;
};
