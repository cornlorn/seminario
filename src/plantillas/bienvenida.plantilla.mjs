import { base } from './index.mjs';

export const plantillaBienvenida = (nombre) => {
  const contenido = `
  <h1>¡Te damos la bienvenida!</h1>
  <p>Hola ${nombre},</p>
  <p>
    Estamos emocionados de que te unas a nuestra comunidad de jugadores. Tu suerte
    comienza aquí, y estamos listos para acompañarte en cada sorteo.
  </p>
  <div class="info-box">
    <ul>
      <li>Acceso a múltiples juegos de lotería</li>
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
    está disponible. ¡Mucha suerte!
  </p>
  <p style="margin-top: 30px">
    ¡Que la suerte esté de tu lado!<br /><strong>El equipo de ${process.env.APP_NAME}</strong>
  </p>
 `;
  return base(contenido);
};
