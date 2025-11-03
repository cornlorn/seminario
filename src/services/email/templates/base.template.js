export const escapeHtml = (text = '') => {
  if (typeof text !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const baseEmailTemplate = ({ title, content, preheader = '' }) => {
  const appName = escapeHtml(process.env.APP_NAME || 'Lotería');

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(title)}</title>
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
      rel="stylesheet"
    />
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

      h3 {
        font-size: 20px;
        color: #1a1a1a;
        margin-bottom: 15px;
        font-weight: 600;
      }

      p {
        color: #666666;
        font-size: 16px;
        margin-bottom: 20px;
      }

      .info-box {
        margin: 30px 0;
        padding: 30px;
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

      ul {
        color: #4a5568;
        font-size: 15px;
        margin-left: 20px;
        margin-bottom: 0;
      }

      ul li {
        margin-bottom: 12px;
      }

      ul li:last-child {
        margin-bottom: 0;
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

      .success-box {
        margin: 30px 0;
        padding: 20px;
        background-color: #d1fae5;
        border-left: 4px solid #10b981;
      }

      .success-box p {
        color: #065f46;
        font-size: 14px;
        margin-bottom: 0;
      }

      .code-box {
        margin: 30px 0;
        padding: 25px;
        background-color: #f9fafb;
        border: 2px dashed #d1d5db;
        text-align: center;
      }

      .code-value {
        font-family: "IBM Plex Mono", monospace;
        font-size: 36px;
        font-weight: 700;
        color: #1f2937;
        letter-spacing: 8px;
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

        .info-box {
          padding: 20px;
        }

        .code-value {
          font-size: 28px;
          letter-spacing: 6px;
        }
      }
    </style>
  </head>
  <body>
    ${preheader ? `<div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>` : ''}
    
    <div class="email-container">
      <div class="header">
        <h1 class="logo">${appName}</h1>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <p>© 2025 ${appName}. Todos los derechos reservados.</p>
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
