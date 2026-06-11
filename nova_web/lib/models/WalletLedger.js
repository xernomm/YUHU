import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class WalletLedger extends Model {}

WalletLedger.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  wallet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'wallets',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reference_type: {
    type: DataTypes.STRING, // e.g. 'commission', 'withdrawal'
    allowNull: true,
  },
  reference_id: {
    type: DataTypes.STRING, // Can hold order ID, commission ID, or withdrawal ID
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'WalletLedger',
  tableName: 'wallet_ledgers',
  timestamps: true,
  underscored: true,
});

export default WalletLedger;
