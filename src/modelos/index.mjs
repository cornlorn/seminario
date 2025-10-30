import { Administrador } from './administrador.modelo.mjs';
import { Billetera } from './billetera.modelo.mjs';
import { Jugador } from './jugador.modelo.mjs';
import { Token } from './token.modelo.mjs';
import { Usuario } from './usuario.modelo.mjs';

Usuario.hasOne(Administrador, { foreignKey: 'usuario', as: 'administrador' });
Administrador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasMany(Token, { foreignKey: 'usuario', as: 'tokens' });
Token.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasOne(Jugador, { foreignKey: 'usuario', as: 'jugador' });
Jugador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Jugador.hasOne(Billetera, { foreignKey: 'jugador', as: 'billetera' });
Billetera.belongsTo(Jugador, { foreignKey: 'jugador', as: 'jugadorDetalles' });

export { Administrador, Billetera, Jugador, Usuario, Token };
