import { Administrador } from './administrador.modelo.mjs';
import { Usuario } from './usuario.modelo.mjs';

Usuario.hasOne(Administrador, { foreignKey: 'usuario', as: 'administrador' });
Administrador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuario' });
