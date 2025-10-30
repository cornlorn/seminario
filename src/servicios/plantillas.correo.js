const plantillaBase = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333; /* Texto principal (casi negro) */
            background-color: #ffffff; /* Fondo del correo */
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
        }
        .container {
            background-color: #f4f4f4; /* Gris claro */
            border: 1px solid #cccccc; /* Borde gris */
            padding: 0;
            margin: 0;
        }
        .header {
            background-color: #000000; /* Negro */
            color: #ffffff; /* Blanco */
            padding: 20px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            background-color: #ffffff; /* Blanco */
            padding: 30px;
        }
        .code-box {
            background-color: #f4f4f4; /* Gris claro */
            border: 1px solid #cccccc; /* Borde gris */
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #000000; /* Negro */
            letter-spacing: 5px;
        }
        .credentials-box {
            background-color: #f4f4f4; /* Gris claro */
            border: 1px solid #cccccc; /* Borde gris */
            padding: 20px;
            margin: 20px 0;
        }
        .credential-item {
            margin: 10px 0;
            padding: 10px;
            background-color: #ffffff; /* Blanco */
            border: 1px solid #eeeeee;
        }
        .credential-label {
            font-weight: bold;
            color: #000000; /* Negro */
        }
        .credential-value {
            font-family: monospace;
            font-size: 16px;
            color: #333;
        }
        .warning {
            background-color: #f4f4f4; /* Gris claro */
            border-left: 4px solid #333333; /* Borde oscuro */
            padding: 15px;
            margin: 20px 0;
        }
        .warning ul {
            margin: 5px 0 0 20px;
            padding: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666; /* Gris oscuro */
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #000000; /* Negro */
            color: #ffffff; /* Blanco */
            text-decoration: none;
            margin: 20px 0;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #333333; /* Gris más oscuro al pasar el ratón */
        }
        p {
            margin: 0 0 15px 0;
        }

        /* Estilos responsivos */
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header {
                padding: 15px 20px;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    ${contenido}
    <div class="footer">
        <p>Este es un correo automático, por favor no responder.</p>
        <p>&copy; ${new Date().getFullYear()} Sistema. Todos los derechos reservados.</p>
    </div>
</body>
</html>
`;

export const plantillaCodigoRecuperacion = (codigo, expiracion) => {
  const contenido = `
        <div class="container">
            <div class="header">
                <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar:</p>
                
                <div class="code-box">
                    <div class="code">${codigo}</div>
                    <p style="margin-top: 10px; margin-bottom: 0; color: #666;">Este código expira en 15 minutos</p>
                </div>

                <p><strong>Expira:</strong> ${expiracion}</p>

                <div class="warning">
                    <strong>⚠️ Importante:</strong>
                    <ul>
                        <li>Si no solicitaste este código, ignora este correo</li>
                        <li>Nunca compartas este código con nadie</li>
                        <li>El código solo es válido por 15 minutos</li>
                    </ul>
                </div>

                <p>Si tienes problemas, contacta a soporte.</p>
            </div>
        </div>
    `;
  return plantillaBase(contenido);
};

export const plantillaCuentaCreada = (correo, contrasena, permiso) => {
  const contenido = `
        <div class="container">
            <div class="header">
                <h1>¡Bienvenido al Sistema!</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Un administrador ha creado una cuenta para ti en nuestro sistema.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #000000;">Tus Credenciales de Acceso</h3>
                    
                    <div class="credential-item">
                        <span class="credential-label">📧 Correo:</span><br>
                        <span class="credential-value">${correo}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">🔑 Contraseña:</span><br>
                        <span class="credential-value">${contrasena}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">👤 Tipo de cuenta:</span><br>
                        <span class="credential-value">${permiso}</span>
                    </div>
                </div>

                <div class="warning">
                    <strong>🔒 Seguridad:</strong>
                    <ul>
                        <li><strong>Cambia tu contraseña</strong> después de tu primer inicio de sesión</li>
                        <li>No compartas tus credenciales con nadie</li>
                        <li>Usa una contraseña fuerte y única</li>
                    </ul>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.APP_URL || '#'}" class="button">Iniciar Sesión</a>
                </div>

                <p>Si no esperabas este correo, contacta inmediatamente al administrador.</p>
            </div>
        </div>
    `;
  return plantillaBase(contenido);
};

export const plantillaBienvenidaCliente = (nombre, correo) => {
  const contenido = `
        <div class="container">
            <div class="header">
                <h1>¡Bienvenido ${nombre}!</h1>
            </div>
            <div class="content">
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>¡Gracias por registrarte en nuestro sistema! Tu cuenta ha sido creada exitosamente.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #000000;">Detalles de tu Cuenta</h3>
                    
                    <div class="credential-item">
                        <span class="credential-label">📧 Correo registrado:</span><br>
                        <span class="credential-value">${correo}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">💰 Saldo inicial:</span><br>
                        <span class="credential-value">L. 0.00</span>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.APP_URL || '#'}" class="button">Acceder a mi Cuenta</a>
                </div>

                <p>Ahora puedes acceder a todas las funcionalidades del sistema.</p>
                
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>
        </div>
    `;
  return plantillaBase(contenido);
};

export const plantillaContrasenaRestablecida = (correo) => {
  const contenido = `
        <div class="container">
            <div class="header">
                <h1>Contraseña Restablecida</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Tu contraseña ha sido restablecida exitosamente.</p>
                
                <div class="credentials-box">
                    <div class="credential-item">
                        <span class="credential-label">📧 Cuenta:</span><br>
                        <span class="credential-value">${correo}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">🕐 Fecha y hora:</span><br>
                        <span class="credential-value">${new Date().toLocaleString('es-HN', { timeZone: 'America/Tegucigalpa' })}</span>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.APP_URL || '#'}" class="button">Iniciar Sesión</a>
                </div>

                <div class="warning">
                    <strong>⚠️ ¿No fuiste tú?</strong>
                    <p style="margin-bottom: 0;">Si no solicitaste este cambio, contacta inmediatamente a soporte para asegurar tu cuenta.</p>
                </div>
            </div>
        </div>
    `;
  return plantillaBase(contenido);
};

export const plantillaInicioSesion = (
  correo,
  permiso,
  dispositivo,
  ubicacion,
  fecha,
) => {
  const contenido = `
        <div class="container">
            <div class="header">
                <h1>Nuevo Inicio de Sesión</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Se ha detectado un nuevo inicio de sesión en tu cuenta.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #000000;">Detalles del Acceso</h3>
                    
                    <div class="credential-item">
                        <span class="credential-label">📧 Cuenta:</span><br>
                        <span class="credential-value">${correo}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">👤 Tipo de usuario:</span><br>
                        <span class="credential-value">${permiso}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">🕐 Fecha y hora:</span><br>
                        <span class="credential-value">${fecha}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">💻 Dispositivo:</span><br>
                        <span class="credential-value">${dispositivo}</span>
                    </div>
                    
                    <div class="credential-item">
                        <span class="credential-label">📍 Ubicación aproximada:</span><br>
                        <span class="credential-value">${ubicacion}</span>
                    </div>
                </div>

                <div class="warning">
                    <strong>⚠️ ¿No fuiste tú?</strong>
                    <p style="margin-bottom: 0;">Si no reconoces este inicio de sesión, tu cuenta podría estar comprometida.</p>
                    <ul>
                        <li>Cambia tu contraseña inmediatamente</li>
                        <li>Contacta a soporte lo antes posible</li>
                        <li>Revisa la actividad reciente de tu cuenta</li>
                    </ul>
                </div>

                <p>Si fuiste tú quien inició sesión, puedes ignorar este correo.</p>
                
                <p><strong>Nota de seguridad:</strong> Nunca compartas tu contraseña con nadie y asegúrate de cerrar sesión en dispositivos compartidos.</p>
            </div>
        </div>
    `;
  return plantillaBase(contenido);
};
