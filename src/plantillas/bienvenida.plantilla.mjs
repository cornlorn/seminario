import { base } from './index.mjs';

export const plantillaBienvenida = (contenido) => {
  const content = `
  <h1>¡Te damos la bienvenida ${nombre}!</h1>
  <p>Hola ${nombre},</p>
  <p>
    Estamos emocionados de que te unas a nuestra comunidad de jugadores. Tu suerte
    comienza aquí, y estamos listos para acompañarte en cada sorteo.
  </p>
  <a href="${urlJuegos}" class="cta-button">Explorar Juegos</a>
  <div class="info-box">
    <ul>
      <li>Acceso a múltiples loterías nacionales e internacionales</li>
      <li>Notificaciones instantáneas de resultados y premios</li>
      <li>Números de la suerte personalizados y estadísticas</li>
    </ul>
  </div>
  <p>
    ¿Listo para probar tu suerte? Comienza eligiendo tu primera lotería y
    selecciona tus números ganadores. Recuerda, cada sorteo es una nueva
    oportunidad.
  </p>
  <p>
    Si tienes alguna pregunta sobre cómo jugar o necesitas ayuda, nuestro equipo
    está disponible 24/7. ¡Mucha suerte!
  </p>
  <p style="margin-top: 30px">
    ¡Que la suerte esté de tu lado!<br /><strong>El Equipo de LottoPlay</strong>
  </p>
 `;
  return base();
};
