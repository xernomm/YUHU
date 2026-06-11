import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class UserDetail extends Model {}

UserDetail.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Unique constraint ensures 1-to-1 relationship
    references: {
      model: 'users',
      key: 'id',
    },
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
  nomor_ktp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_npwp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provinsi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kabupaten_kota: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kecamatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desa_kelurahan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat_lengkap: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'UserDetail',
  tableName: 'user_details',
  timestamps: true,
  underscored: true,
});

export default UserDetail;
