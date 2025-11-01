import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config.mjs';

export const Transaccion = sequelize.define(
  'Transaccion',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tipo: {
      type: DataTypes.ENUM('Compra', 'Premio', 'Deposito', 'Retiro', 'Ajuste'),
      allowNull: false,
      comment: 'Tipo de transacción realizada',
    },
    concepto: { type: DataTypes.STRING(255), allowNull: false, comment: 'Descripción de la transacción' },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto de la transacción (positivo o negativo)',
    },
    saldo_anterior: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'Saldo antes de la transacción' },
    saldo_nuevo: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'Saldo después de la transacción' },
    referencia: { type: DataTypes.STRING, allowNull: true, comment: 'ID de referencia (boleto_id, sorteo_id, etc)' },
    vendedor: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: 'vendedores', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'ID del vendedor que procesó la transacción (si aplica)',
    },
    metadata: { type: DataTypes.JSON, allowNull: true, comment: 'Información adicional en formato JSON' },
  },
  {
    tableName: 'transacciones',
    timestamps: true,
    createdAt: 'creado',
    updatedAt: 'actualizado',
    indexes: [{ fields: ['usuario'] }, { fields: ['tipo'] }, { fields: ['creado'] }, { fields: ['referencia'] }],
  },
);
