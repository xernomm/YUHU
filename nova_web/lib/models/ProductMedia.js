import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

class ProductMedia extends Model {}

ProductMedia.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id',
    },
  },
  media_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProductMedia',
  tableName: 'product_media',
  timestamps: true,
  underscored: true,
});

export default ProductMedia;
