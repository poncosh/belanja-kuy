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
    store_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Store tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Store tidak boleh kosong!"
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Location tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Location tidak boleh kosong!"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Description tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Description tidak boleh kosong!"
        }
      }
    },
    UserId: DataTypes.INTEGER,
    product_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Product sold tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Product sold tidak boleh kosong!"
        },
        isNumeric : {
          args: true,
          msg: "Price harus number"
        }
      }
    },
    account_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Product sold tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Product sold tidak boleh kosong!"
        },
        isNumeric : {
          args: true,
          msg: "Price harus number"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};