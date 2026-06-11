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
    type: DataTypes.ENUM('member', 'affiliator', 'reseller', 'mitra_prioritas', 'admin'),
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
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

export default User;
