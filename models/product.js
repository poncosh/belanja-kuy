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
      Product.hasMany(models.Rating);
    }
  }
  Product.init({
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Nama product tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Nama product tidak boleh kosong!"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Stock tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Stock tidak boleh kosong!"
        },
        isNumeric : {
          args: true,
          msg: "Stock harus number"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Price tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Price tidak boleh kosong!"
        },
        isNumeric : {
          args: true,
          msg: "Price harus number"
        }
      }
    },
    StoreId: DataTypes.INTEGER,
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Image URL tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Image URL tidak boleh kosong!"
        },
        isLink(value) {
          var isUriImage = function(uri) {
            //make sure we remove any nasty GET params 
            uri = uri.split('?')[0];
            //moving on now
            var parts = uri.split('.');
            var extension = parts[parts.length-1];
            var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp']
            if(imageTypes.indexOf(extension) !== -1) {
                return true;   
            }
        }
          if(!isUriImage(value)) {
            throw new Error("Format gambar tidak di support")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};