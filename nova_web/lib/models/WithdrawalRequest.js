import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class WithdrawalRequest extends Model {}

WithdrawalRequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  bank: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_rekening: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pemilik_rekening: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'WithdrawalRequest',
  tableName: 'withdrawal_requests',
  timestamps: true,
  underscored: true,
});

export default WithdrawalRequest;
