export const base = (contenido) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap");
  
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
        }
  
        .content {
          padding: 50px 40px;
        }
  
        h1 {
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
  
        .cta-button {
          display: inline-block;
          margin: 30px 0;
          padding: 12px 32px;
          background-color: #ff6b35;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          border: 1px solid #e85a28;
        }
  
        .cta-button:hover {
          background-color: #e85a28;
        }
  
        .info-box {
          margin: 30px 0;
          padding: 30px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
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
  
        .social-links {
          margin: 20px 0 10px;
        }
  
        .social-links a {
          display: inline-block;
          margin: 0 8px;
          color: #999999;
          text-decoration: none;
          font-size: 14px;
        }
  
        .social-links a:hover {
          color: #ff6b35;
        }
  
        .unsubscribe {
          color: #999999;
          font-size: 12px;
          text-decoration: none;
        }
  
        .unsubscribe:hover {
          text-decoration: underline;
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
  
          h1 {
            font-size: 24px;
          }
  
          .logo {
            font-size: 28px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">${process.env.APP_NAME}</div>
        </div>
  
        <div class="content">${contenido}</div>
  
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. Todos los derechos reservados.</p>
          <p>
            Juega responsablemente. ${process.env.APP_NAME} es una plataforma de entretenimiento.
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
};
