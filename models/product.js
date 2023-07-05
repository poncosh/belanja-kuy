'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Store);
      Product.hasMany(models.Rating, { foreignKey: "ProductId" });
    }
  }
  Product.init({
    product_name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    StoreId: DataTypes.INTEGER,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};