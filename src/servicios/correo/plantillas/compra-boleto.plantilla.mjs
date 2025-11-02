export const plantillaCompraBoleto = (nombre, boletos, sorteo, total) => {
  const escapeHtml = (text) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const nombreSeguro = escapeHtml(nombre);

  const filasBoletos = boletos
    .map(
      (boleto) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 24px; font-weight: 600; color: #ff6b35;">
        ${boleto.numero}
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">
        L${parseFloat(boleto.monto).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Confirmación de compra - ${process.env.APP_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
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
      }

      p {
        color: #666666;
        font-size: 16px;
        margin-bottom: 20px;
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

      .tickets-table {
        width: 100%;
        margin: 30px 0;
        border-collapse: collapse;
        border: 1px solid #e5e7eb;
      }

      .tickets-table th {
        background-color: #f9fafb;
        padding: 15px;
        text-align: center;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;
      }

      .total-box {
        margin: 30px 0;
        padding: 25px;
        background-color: #f0fdf4;
        border: 2px solid #86efac;
        text-align: center;
      }

      .total-label {
        font-size: 14px;
        color: #166534;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 10px;
      }

      .total-amount {
        font-size: 36px;
        font-weight: 700;
        color: #15803d;
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

        .total-amount {
          font-size: 28px;
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
        <h2>¡Compra confirmada!</h2>
        
        <p>Hola ${nombreSeguro},</p>

        <p>
          Tu compra se ha procesado exitosamente. Tus números ya están participando en el sorteo.
          ¡Te deseamos mucha suerte!
        </p>

        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Fecha del sorteo:</span>
            <span class="info-value">${sorteo.fecha}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hora del sorteo:</span>
            <span class="info-value">${sorteo.hora}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cantidad de boletos:</span>
            <span class="info-value">${boletos.length}</span>
          </div>
        </div>

        <table class="tickets-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Monto apostado</th>
            </tr>
          </thead>
          <tbody>
            ${filasBoletos}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-label">Total pagado</div>
          <div class="total-amount">L${parseFloat(total).toFixed(2)}</div>
        </div>

        <div class="alert-box">
          <p>
            <strong>Premio potencial:</strong> Si acertás el número ganador, podés ganar hasta 
            <strong>L${(parseFloat(total) * 60).toFixed(2)}</strong> (60 veces tu inversión).
          </p>
        </div>

        <p>
          Los resultados del sorteo se publicarán automáticamente a la hora indicada.
          Te notificaremos por correo si resultás ganador.
        </p>

        <p style="margin-top: 30px">
          ¡Buena suerte!<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
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
