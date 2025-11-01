import { Administrador } from './administrador.modelo.mjs';
import { Billetera } from './billetera.modelo.mjs';
import { Boleto } from './boleto.modelo.mjs';
import { Juego } from './juego.modelo.mjs';
import { Jugador } from './jugador.modelo.mjs';
import { Modalidad } from './modalidad.modelo.mjs';
import { Notificacion } from './notificacion.modelo.mjs';
import { Sorteo } from './sorteo.modelo.mjs';
import { Token } from './token.modelo.mjs';
import { Transaccion } from './transaccion.modelo.mjs';
import { Usuario } from './usuario.modelo.mjs';
import { Vendedor } from './vendedor.modelo.mjs';

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
