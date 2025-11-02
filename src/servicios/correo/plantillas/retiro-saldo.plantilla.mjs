export const plantillaRetiroSaldo = (nombre, monto, saldoNuevo, vendedor) => {
  const escapeHtml = (text) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const nombreSeguro = escapeHtml(nombre);
  const vendedorSeguro = escapeHtml(vendedor);

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Retiro realizado - ${process.env.APP_NAME}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #f5f5f5;
        padding: 40px 20px;
        line-height: 1.6;
      }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; }
      .header {
        background-color: #3b82f6;
        padding: 50px 40px;
        text-align: center;
        border-bottom: 1px solid #2563eb;
      }
      .logo { font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; margin: 0; }
      .content { padding: 50px 40px; }
      h2 { font-size: 28px; color: #1e40af; margin-bottom: 20px; font-weight: 700; text-align: center; }
      p { color: #666666; font-size: 16px; margin-bottom: 20px; }
      .amount-box {
        margin: 40px 0;
        padding: 40px;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border: 3px solid #3b82f6;
        text-align: center;
        border-radius: 8px;
      }
      .amount-label {
        font-size: 16px;
        color: #1e3a8a;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        font-weight: 600;
      }
      .amount-value {
        font-family: "IBM Plex Mono", monospace;
        font-size: 56px;
        font-weight: 700;
        color: #1e40af;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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
      .info-row:last-child { margin-bottom: 0; }
      .info-label { color: #6b7280; font-weight: 500; }
      .info-value { color: #1f2937; font-weight: 600; }
      .footer {
        padding: 30px 40px;
        background-color: #fafafa;
        text-align: center;
        border-top: 1px solid #e5e5e5;
      }
      .footer p { color: #999999; font-size: 13px; margin-bottom: 10px; }
      .divider { height: 1px; background-color: #e5e5e5; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1 class="logo">${process.env.APP_NAME}</h1>
      </div>

      <div class="content">
        <h2>Retiro realizado</h2>
        
        <p>Hola ${nombreSeguro},</p>

        <p>Se ha procesado exitosamente el retiro de fondos de tu cuenta.</p>

        <div class="amount-box">
          <div class="amount-label">Monto retirado</div>
          <div class="amount-value">L${parseFloat(monto).toFixed(2)}</div>
        </div>

        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Procesado por:</span>
            <span class="info-value">${vendedorSeguro}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nuevo saldo:</span>
            <span class="info-value">L${parseFloat(saldoNuevo).toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span class="info-value">${new Date().toLocaleString('es-HN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}</span>
          </div>
        </div>

        <p>
          Si no realizaste esta operación o tienes alguna duda, contacta inmediatamente a soporte.
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
