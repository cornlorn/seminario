import { base } from './index.mjs';

export const plantillaRestablecimiento = () => {
  const contenido = `
  <h1>Contraseña actualizada exitosamente</h1>
  <p>
    Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
  </p>
  <div class="info-box">
    <p style="color: #16a34a; font-weight: 600; margin: 0;">
      ✓ Tu cuenta está segura
    </p>
  </div>
  <p>
    Si no realizaste este cambio, te recomendamos que te pongas en contacto con nuestro 
    equipo de soporte inmediatamente para proteger tu cuenta.
  </p>
  <p style="margin-top: 30px">
    Gracias por mantener tu cuenta segura.<br />
    <strong>El equipo de ${process.env.APP_NAME}</strong>
  </p>
  `;
  return base(contenido);
};
