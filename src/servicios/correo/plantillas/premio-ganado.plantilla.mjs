export const plantillaPremioGanado = (nombre, numeroGanador, montoGanado, fecha, hora) => {
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
    <title>¡Felicidades! - ${process.env.APP_NAME}</title>
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
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        padding: 50px 40px;
        text-align: center;
        border-bottom: 1px solid #047857;
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

      .celebration {
        text-align: center;
        margin-bottom: 30px;
      }

      .celebration-icon {
        font-size: 64px;
        margin-bottom: 15px;
      }

      h2 {
        font-size: 32px;
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

      .prize-box {
        margin: 40px 0;
        padding: 40px;
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border: 3px solid #10b981;
        text-align: center;
        border-radius: 8px;
      }

      .prize-label {
        font-size: 16px;
        color: #065f46;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        font-weight: 600;
      }

      .prize-amount {
        font-family: "IBM Plex Mono", monospace;
        font-size: 56px;
        font-weight: 700;
        color: #047857;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 10px;
      }

      .prize-subtitle {
        font-size: 14px;
        color: #065f46;
        font-weight: 500;
      }

      .winner-details {
        margin: 30px 0;
        padding: 30px;
        background-color: #f0fdf4;
        border: 2px solid #86efac;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-size: 16px;
      }

      .detail-row:last-child {
        margin-bottom: 0;
      }

      .detail-label {
        color: #166534;
        font-weight: 500;
      }

      .detail-value {
        color: #15803d;
        font-weight: 700;
        font-family: "IBM Plex Mono", monospace;
      }

      .success-box {
        margin: 30px 0;
        padding: 25px;
        background-color: #f0f9ff;
        border-left: 4px solid #0ea5e9;
      }

      .success-box p {
        color: #075985;
        font-size: 15px;
        margin-bottom: 0;
      }

      .cta-button {
        display: inline-block;
        margin: 30px 0;
        padding: 15px 40px;
        background-color: #10b981;
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

        .prize-amount {
          font-size: 40px;
        }

        .prize-box {
          padding: 30px 20px;
        }

        h2 {
          font-size: 26px;
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
        <div class="celebration">
          <div class="celebration-icon">🎉</div>
        </div>

        <h2>¡Felicidades ${nombreSeguro}!</h2>
        
        <p style="text-align: center; font-size: 18px; color: #059669; font-weight: 600;">
          ¡Has ganado un premio en el sorteo de Diaria!
        </p>

        <div class="prize-box">
          <div class="prize-label">Tu premio</div>
          <div class="prize-amount">L${parseFloat(montoGanado).toFixed(2)}</div>
          <div class="prize-subtitle">Ya acreditado en tu billetera</div>
        </div>

        <div class="winner-details">
          <div class="detail-row">
            <span class="detail-label">Número ganador:</span>
            <span class="detail-value">${numeroGanador}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha del sorteo:</span>
            <span class="detail-value">${fecha}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Hora del sorteo:</span>
            <span class="detail-value">${hora}</span>
          </div>
        </div>

        <div class="success-box">
          <p>
            <strong>¡Buenas noticias!</strong> El premio ha sido acreditado automáticamente 
            a tu billetera. Podés verificar tu nuevo saldo en tu cuenta.
          </p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="cta-button">
            Ver mi billetera
          </a>
        </div>

        <p>
          ¿Querés seguir probando tu suerte? Tenemos sorteos todos los días a las
          11:00 AM, 3:00 PM y 9:00 PM. ¡El próximo premio podría ser aún mayor!
        </p>

        <p style="margin-top: 30px; text-align: center; font-size: 18px; color: #059669; font-weight: 600;">
          ¡Gracias por jugar con nosotros!
        </p>

        <p style="text-align: center;">
          <strong>El equipo de ${process.env.APP_NAME}</strong>
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
