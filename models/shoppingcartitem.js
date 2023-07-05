'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShoppingCartItem.belongsTo(models.ShoppingCart)
    }
  }
  ShoppingCartItem.init({
    ProductId: DataTypes.INTEGER,
    ShoppingCartId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShoppingCartItem',
  });
  return ShoppingCartItem;
};