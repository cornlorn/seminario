import jwt from 'jsonwebtoken';

export const verificarToken = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response
      .status(401)
      .json({ mensaje: 'Token no proporcionado o formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.usuario = decoded; // { id, correo, permiso }
    next();
  } catch (error) {
    console.error(error);
    return response.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

export const esAdministrador = (request, response, next) => {
  if (request.usuario.permiso !== 'Administrador') {
    return response
      .status(403)
      .json({
        mensaje: 'Acceso denegado. Se requieren privilegios de administrador',
      });
  }
  next();
};

export const esAdminOEmpleado = (request, response, next) => {
  if (!['Administrador', 'Empleado'].includes(request.usuario.permiso)) {
    return response
      .status(403)
      .json({
        mensaje:
          'Acceso denegado. Se requieren privilegios de administrador o empleado',
      });
  }
  next();
};

export const soloRegistroCliente = (request, response, next) => {
  if (request.body.permiso && request.body.permiso !== 'Cliente') {
    return response
      .status(403)
      .json({
        mensaje: 'Solo se pueden registrar cuentas de cliente públicamente',
      });
  }
  next();
};
