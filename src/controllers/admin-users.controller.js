/**
 * Admin users management controller
 * Handles CRUD operations for user management by administrators
 */

import { Administrador, Jugador, Usuario, Vendedor, Billetera } from '../models/index.js';

/**
 * List all users with filters
 * @route GET /admin/usuarios
 */
export const listarUsuarios = async (request, response) => {
  try {
    const { rol, estado, limite = 50, pagina = 1 } = request.query;

    const where = {};
    if (rol) where.rol = rol;
    if (estado) where.estado = estado;

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows: usuarios } = await Usuario.findAndCountAll({
      where,
      attributes: { exclude: ['contrasena'] },
      limit: parseInt(limite),
      offset,
      order: [['creado', 'DESC']],
    });

    return response
      .status(200)
      .json({
        mensaje: 'Usuarios obtenidos exitosamente',
        usuarios,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(count / parseInt(limite)),
        },
      });
  } catch (error) {
    console.error('Error al listar usuarios:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Get user details by ID
 * @route GET /admin/usuarios/:id
 */
export const obtenerUsuario = async (request, response) => {
  try {
    const { id } = request.params;

    const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });

    if (!usuario) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Get role-specific profile
    let perfil = null;
    if (usuario.rol === 'Administrador') {
      perfil = await Administrador.findOne({ where: { usuario: id } });
    } else if (usuario.rol === 'Vendedor') {
      perfil = await Vendedor.findOne({ where: { usuario: id } });
    } else if (usuario.rol === 'Jugador') {
      perfil = await Jugador.findOne({ where: { usuario: id }, include: [{ model: Billetera, as: 'billetera' }] });
    }

    return response.status(200).json({ mensaje: 'Usuario obtenido exitosamente', usuario, perfil });
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Update user status (activate/deactivate)
 * @route PUT /admin/usuarios/:id
 */
export const actualizarUsuario = async (request, response) => {
  try {
    const { id } = request.params;
    const { estado } = request.body;

    if (!estado || !['Activo', 'Inactivo'].includes(estado)) {
      return response.status(400).json({ error: 'Estado inválido. Debe ser "Activo" o "Inactivo"' });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Prevent admin from deactivating themselves
    if (usuario.id === request.usuario.id && estado === 'Inactivo') {
      return response.status(400).json({ error: 'No puedes desactivar tu propia cuenta' });
    }

    usuario.estado = estado;
    await usuario.save();

    return response
      .status(200)
      .json({
        mensaje: `Usuario ${estado === 'Activo' ? 'activado' : 'desactivado'} exitosamente`,
        usuario: { id: usuario.id, correo: usuario.correo, rol: usuario.rol, estado: usuario.estado },
      });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Delete user (soft delete by changing estado to Inactivo)
 * @route DELETE /admin/usuarios/:id
 */
export const eliminarUsuario = async (request, response) => {
  try {
    const { id } = request.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Prevent admin from deleting themselves
    if (usuario.id === request.usuario.id) {
      return response.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    // Soft delete - just set estado to Inactivo
    usuario.estado = 'Inactivo';
    await usuario.save();

    return response.status(200).json({ mensaje: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * List all sellers
 * @route GET /admin/vendedores
 */
export const listarVendedores = async (request, response) => {
  try {
    const { limite = 50, pagina = 1 } = request.query;
    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const { count, rows: vendedores } = await Vendedor.findAndCountAll({
      include: [{ model: Usuario, as: 'usuarioData', attributes: ['id', 'correo', 'rol', 'estado', 'creado'] }],
      limit: parseInt(limite),
      offset,
      order: [['creado', 'DESC']],
    });

    return response
      .status(200)
      .json({
        mensaje: 'Vendedores obtenidos exitosamente',
        vendedores,
        paginacion: {
          total: count,
          pagina: parseInt(pagina),
          limite: parseInt(limite),
          paginas: Math.ceil(count / parseInt(limite)),
        },
      });
  } catch (error) {
    console.error('Error al listar vendedores:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor' });
  }
};
