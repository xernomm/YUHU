import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sku_product: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nama_product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jenis_product: {
    type: DataTypes.STRING, // String/Enum. Using String offers greater flexbility.
    allowNull: false,
  },
  harga: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  main_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

export default Product;
