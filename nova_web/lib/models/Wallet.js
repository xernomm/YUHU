import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class Wallet extends Model {}

Wallet.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  locked_balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'wallets',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

export default Wallet;
