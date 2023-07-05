const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");

class Controller {
  static renderProduct(req, res) {
    sequelize
      .query(`SELECT "Product".*, "Stores".*, avg("Ratings".rating) AS "avg_rating" FROM "Products" AS "Product" JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`, { type: QueryTypes.SELECT }
      )
      .then(products => res.render("Product", {products}))
      .catch(err => console.log(err))
  }
}

module.exports = Controller;