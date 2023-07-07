'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get fullName() {
      return `${this.first_name} ${this.last_name}`
    }
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User)
    }
  }
  UserProfile.init({
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate : {
        notEmpty: {
          msg: "Date of birth tidak boleh kosong"
        },
        notNull: {
          msg: "Date of birth tidak boleh kosong"
        }
      }
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Profile picture tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Profile picture tidak boleh kosong!"
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
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Address tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Address tidak boleh kosong!"
        }
      }
    },
    UserId: DataTypes.INTEGER,
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "First name tidak boleh kosong!"
        },
        notEmpty : {
          msg: "First name tidak boleh kosong!"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull : {
          msg: "Last name tidak boleh kosong!"
        },
        notEmpty : {
          msg: "Last name tidak boleh kosong!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};