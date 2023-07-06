const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");

class Controller {
  static renderProduct(req, res) {
    sequelize
      .query(`SELECT "Product".*, "Stores"."store_name", avg("Ratings".rating) AS "avg_rating" FROM "Products" AS "Product" JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`, { type: QueryTypes.SELECT }
      )
      .then(products => res.render("Product", {products}))
      .catch(err => console.log(err))
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
      .catch(err => console.log(err))
  }

  static renderStores(req, res) {
    sequelize
      .query(`SELECT "Store"."id", "Store"."store_name", "Store"."location", "Store"."description", "Store"."account_created", "Store"."product_sold", "Store"."account_number", "Store"."createdAt", "Store"."updatedAt", CAST(SUM("Products".stock) AS INTEGER) AS total_stock FROM "Stores" AS "Store" LEFT OUTER JOIN "Products" AS "Products" ON "Store"."id" = "Products"."StoreId" GROUP BY "Store"."id"`, { type: QueryTypes.SELECT })
      .then(stores => res.render("Stores", { stores }))
      .catch(err => console.log(err))
  }
}

module.exports = Controller;