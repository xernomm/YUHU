import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class CommissionHistory extends Model {}

CommissionHistory.init({
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
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'CommissionHistory',
  tableName: 'commission_histories',
  timestamps: true,
  underscored: true,
});

export default CommissionHistory;
