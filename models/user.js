'use strict';
const bcrypt = require("bcryptjs");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.ShoppingCart)
      User.hasOne(models.UserProfile)
      User.hasOne(models.Store)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg: "Username tidak boleh kosong"
        },
        notNull: {
          msg: "Username tidak boleh kosong"
        }
      },
      unique: {
        args: true,
        msg: "Username telah terdaftar"
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email telah terdaftar"
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg: "Password tidak boleh kosong"
        },
        notNull: {
          msg: "Password tidak boleh kosong"
        },
        isUniquePas(value) {
          const onlyLettersAndNumbers = (str) => {
            return /^[A-Za-z0-9]*$/.test(str);
          }
          if(!onlyLettersAndNumbers(value)) {
            throw new Error ("Password harus memiliki beberapa variabel huruf dan angka!")
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notEmpty: {
          msg: "Role tidak boleh kosong"
        },
        notNull: {
          msg: "Role tidak boleh kosong"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook("beforeCreate", async (instance, options) => {
    try {
      instance.password = await bcrypt.hash(instance.password, 10);
    } catch {
      throw new Error("Failed hashing password")
    }
  })
  return User;
};