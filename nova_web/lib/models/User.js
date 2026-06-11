import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  no_telp: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field for phone number
  },
  role: {
    type: DataTypes.ENUM('member', 'affiliator', 'reseller', 'mitra_prioritas'),
    defaultValue: 'member',
    allowNull: false,
  },
  referral_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sponsor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

export default User;
