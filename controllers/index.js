const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");
const { getIdr } = require("../helpers")

class Controller {
  static renderProduct(req, res) {
    sequelize
      .query(`SELECT "Product".*, "Stores"."store_name" AS "store_name", avg("Ratings".rating) AS "avg_rating" FROM "Products" AS "Product" JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`, { type: QueryTypes.SELECT }
      )
      .then(products => res.render("Product", {products, getIdr}))
      .catch(err => res.send(err))
  }

  static detailProduct(req, res) {
    const { productId } = req.params

    Product
      .findOne({
        where: {
          id: productId
        },
        include: {
          model: Rating
        }
      })
      .then(product => res.send(product))
      .catch(err => res.send(err))
  }
}

module.exports = Controller;