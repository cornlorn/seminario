import { Billetera } from './billetera.modelo.js';
import { Cliente } from './cliente.modelo.js';
import { Departamento } from './departamento.modelo.js';
import { Municipio } from './municipio.modelo.js';
import { Usuario } from './usuario.modelo.js';

Usuario.hasOne(Cliente, {
  foreignKey: 'usuario',
  as: 'cliente',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Cliente.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioInfo' });

Usuario.hasOne(Billetera, {
  foreignKey: 'usuario',
  as: 'billetera',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Billetera.belongsTo(Usuario, { foreignKey: 'usuario', as: 'usuarioInfo' });

Departamento.hasMany(Municipio, {
  foreignKey: 'departamento',
  as: 'municipios',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Municipio.belongsTo(Departamento, {
  foreignKey: 'departamento',
  as: 'departamentoInfo',
});

Departamento.hasMany(Cliente, {
  foreignKey: 'departamento',
  as: 'clientes',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Cliente.belongsTo(Departamento, {
  foreignKey: 'departamento',
  as: 'departamentoInfo',
});

Municipio.hasMany(Cliente, {
  foreignKey: 'municipio',
  as: 'clientes',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Cliente.belongsTo(Municipio, { foreignKey: 'municipio', as: 'municipioInfo' });

export { Billetera, Cliente, Departamento, Municipio, Usuario };
