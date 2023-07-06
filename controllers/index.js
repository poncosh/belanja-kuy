const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");
const formatPrice = require("../helpers/formatPrice");

class Controller {
  static renderProduct(req, res) {
    sequelize
      .query(
        `SELECT "Product".*, "Stores"."store_name", avg("Ratings".rating) AS "avg_rating" FROM "Products" AS "Product" JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`,
        { type: QueryTypes.SELECT }
      )
      .then((products) => res.render("Product", { products }))
      .catch((err) => console.log(err));
  }

  static detailProduct(req, res) {
    const { productId } = req.params;
    Product.findOne({
      where: {
        id: productId,
      },
      include: {
        model: Rating,
      },
    })
      .then((products) => {
        let rating = products.dataValues.Ratings;
        res.render("DetailProduct", { products, rating, formatPrice });
        // res.send(products);
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Controller;
