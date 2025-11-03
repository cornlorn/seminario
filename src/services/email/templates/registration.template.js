import { baseEmailTemplate, escapeHtml } from './base.template.js';

export const plantillaRegistro = (nombre) => {
  const nombreSeguro = escapeHtml(nombre);
  const appName = escapeHtml(process.env.APP_NAME || 'Lotería');

  const content = `
    <p>Hola ${nombreSeguro},</p>

    <p>
      Estamos emocionados de que te unas a nuestra comunidad de jugadores.
      Tu suerte comienza aquí, y estamos listos para acompañarte en cada
      sorteo.
    </p>

    <div class="info-box">
      <ul>
        <li>Acceso a múltiples juegos de lotería</li>
        <li>Notificaciones de resultados y premios</li>
        <li>Elige tus números de la suerte</li>
        <li>Historial completo de tus resultados</li>
      </ul>
    </div>

    <p>
      ¿Listo para probar tu suerte? Comienza eligiendo tu primera lotería y
      selecciona tus números ganadores. Recuerda, cada sorteo es una nueva
      oportunidad.
    </p>

    <p>
      Si tienes alguna pregunta sobre cómo jugar o necesitas ayuda, nuestro
      equipo está disponible 24/7.
    </p>

    <p style="margin-top: 30px">
      Saludos,<br /><strong>El equipo de ${appName}</strong>
    </p>
  `;

  return baseEmailTemplate({
    title: `Bienvenido a ${appName}`,
    content,
    preheader: 'Bienvenido a nuestra comunidad de jugadores',
  });
};
