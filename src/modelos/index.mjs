import { Administrador } from './administrador.modelo.mjs';
import { Jugador } from './jugador.modelo.mjs';
import { Usuario } from './usuario.modelo.mjs';

Usuario.hasOne(Administrador, { foreignKey: 'usuario', as: 'administrador' });
Administrador.belongsTo(Usuario, {
  foreignKey: 'usuario',
  as: 'usuarioDetails',
});

Usuario.hasOne(Jugador, { foreignKey: 'usuario', as: 'jugador' });
Jugador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetails' });

export { Administrador, Jugador, Usuario };
