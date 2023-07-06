'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.hasMany(models.Product)
      Store.belongsTo(models.User)
    }
  }
  Store.init({
    store_name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
    account_created: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    product_sold: DataTypes.INTEGER,
    account_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};