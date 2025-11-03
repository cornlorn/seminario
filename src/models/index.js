import { Administrador } from './admin.model.js';
import { Billetera } from './wallet.model.js';
import { Boleto } from './ticket.model.js';
import { Juego } from './game.model.js';
import { Jugador } from './player.model.js';
import { Modalidad } from './modality.model.js';
import { Notificacion } from './notification.model.js';
import { Sorteo } from './draw.model.js';
import { Token } from './token.model.js';
import { Transaccion } from './transaction.model.js';
import { Usuario } from './user.model.js';
import { Vendedor } from './seller.model.js';

Usuario.hasOne(Administrador, { foreignKey: 'usuario', as: 'administrador' });
Administrador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasOne(Vendedor, { foreignKey: 'usuario', as: 'vendedor' });
Vendedor.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasMany(Token, { foreignKey: 'usuario', as: 'tokens' });
Token.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasOne(Jugador, { foreignKey: 'usuario', as: 'jugador' });
Jugador.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasMany(Transaccion, { foreignKey: 'usuario', as: 'transacciones' });
Transaccion.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Usuario.hasMany(Notificacion, { foreignKey: 'usuario', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioDetalles' });

Jugador.hasOne(Billetera, { foreignKey: 'jugador', as: 'billetera' });
Billetera.belongsTo(Jugador, { foreignKey: 'jugador', as: 'jugadorDetalles' });

Jugador.hasMany(Boleto, { foreignKey: 'jugador', as: 'boletos' });
Boleto.belongsTo(Jugador, { foreignKey: 'jugador', as: 'jugadorDetalles' });

Vendedor.hasMany(Transaccion, { foreignKey: 'vendedor', as: 'transacciones' });
Transaccion.belongsTo(Vendedor, { foreignKey: 'vendedor', as: 'vendedorDetalles' });

Juego.hasMany(Modalidad, { foreignKey: 'juego', as: 'modalidades' });
Modalidad.belongsTo(Juego, { foreignKey: 'juego', as: 'juegoDetalles' });

Modalidad.hasMany(Sorteo, { foreignKey: 'modalidad', as: 'sorteos' });
Sorteo.belongsTo(Modalidad, { foreignKey: 'modalidad', as: 'modalidadDetalles' });

Sorteo.hasMany(Boleto, { foreignKey: 'sorteo', as: 'boletos' });
Boleto.belongsTo(Sorteo, { foreignKey: 'sorteo', as: 'sorteoDetalles' });

export {
  Administrador,
  Billetera,
  Boleto,
  Juego,
  Jugador,
  Modalidad,
  Notificacion,
  Sorteo,
  Token,
  Transaccion,
  Usuario,
  Vendedor,
};
