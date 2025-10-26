const plantillaBase = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .code-box {
            background-color: #e8f5e9;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #2e7d32;
            letter-spacing: 5px;
        }
        .credentials-box {
            background-color: #fff3e0;
            border: 2px solid #ff9800;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        .credential-item {
            margin: 10px 0;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
        }
        .credential-label {
            font-weight: bold;
            color: #f57c00;
        }
        .credential-value {
            font-family: monospace;
            font-size: 16px;
            color: #333;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
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
                <h1>🔐 Recuperación de Contraseña</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar:</p>
                
                <div class="code-box">
                    <div class="code">${codigo}</div>
                    <p style="margin-top: 10px; color: #666;">Este código expira en 15 minutos</p>
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
                <h1>🎉 ¡Bienvenido al Sistema!</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Un administrador ha creado una cuenta para ti en nuestro sistema.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #f57c00;">Tus Credenciales de Acceso</h3>
                    
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
                    <a href="${process.env.APP_URL || "#"}" class="button">Iniciar Sesión</a>
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
                <h1>🎊 ¡Bienvenido ${nombre}!</h1>
            </div>
            <div class="content">
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>¡Gracias por registrarte en nuestro sistema! Tu cuenta ha sido creada exitosamente.</p>
                
                <div class="credentials-box">
                    <h3 style="margin-top: 0; color: #f57c00;">Detalles de tu Cuenta</h3>
                    
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
                    <a href="${process.env.APP_URL || "#"}" class="button">Acceder a mi Cuenta</a>
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
                <h1>✅ Contraseña Restablecida</h1>
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
                        <span class="credential-value">${new Date().toLocaleString("es-HN", { timeZone: "America/Tegucigalpa" })}</span>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${process.env.APP_URL || "#"}" class="button">Iniciar Sesión</a>
                </div>

                <div class="warning">
                    <strong>⚠️ ¿No fuiste tú?</strong>
                    <p>Si no solicitaste este cambio, contacta inmediatamente a soporte para asegurar tu cuenta.</p>
                </div>
            </div>
        </div>
    `;
    return plantillaBase(contenido);
};
