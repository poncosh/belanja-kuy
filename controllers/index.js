const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs")

class Controller {
  static loginPage(req, res) {
    res.render("Login", { errors: req.query.errors ? req.query.errors : false,  })
  }

  static postLogin(req, res) {
    const { email, password } = req.body;

    User.findOne({
      where: {
        email
      }
    })
    .then(async user => {
      try {
        if(await bcrypt.compare(password, user.password)) {
          req.session.userId = user.id;
          req.session.user = { username: user.username , role: user.role }

          return res.redirect("/product")
        } else {
          const errorMsg = "Invalid email/password"
          return res.redirect(`/login?errors=${errorMsg}`)
        }
      } catch (e) {
        const errorMsg = "Invalid email/password"
        return res.redirect(`/login?errors=${errorMsg}`)
      }
    })
    .catch(err => res.send(err))
  }

  static registerUser(req, res) {
    res.render("Register")
  }

  static postUser(req, res) {
    const { username, email, password, role } = req.body

    User
      .create({ 
        username,
        email,
        password,
        role
      })
      .then(result => res.redirect("/login"))
      .catch(err => res.redirect("/register"))
  }

  static renderProduct(req, res) {
    sequelize
      .query(`SELECT "Product".*, "Stores"."store_name", avg("Ratings".rating) AS "avg_rating" FROM "Products" AS "Product" JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`, { type: QueryTypes.SELECT }
      )
      .then(products => res.render("Product", { errors: req.query.errors ? req.query.errors : false, id: req.session.userId, products}))
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
      .then(stores => res.render("Stores", { errors: req.query.errors ? req.query.errors : false, id: req.session.userId ? req.session.userId : false, stores }))
      .catch(err => console.log(err))
  }

  static addStore(req, res) {
    const { userId } = req.params

    User
    .findOne({
      where: {
        id: userId
      },
      include: {
        model: Store
      }
    })
    .then(user => {
      console.log(user);
      if(user.Store) {
        const errorMesage = "Anda sudah memiliki store!"
        res.redirect(`/store?errors=${errorMesage}`)
      } else {
        res.render("Add Store")
      }
    })
    .catch(err => res.send(err))

  }

  static saveAddedStore(req, res) {

  }

  static addProduct (req, res) {
    const { userId } = req.params
    console.log(userId);
    User
    .findOne({
      where: {
        id: userId
      },
      include: {
        model: Store
      }
    })
      .then(data => {
        if (!data.Store) {
          const errorMesage = "Anda harus membuat store terlebih dahulu!"
          res.redirect(`/product?errors=${errorMesage}`)
        } else {
          res.render("Add Product")
        }
      })
      .catch(err => console.log(err))
  }
}

module.exports = Controller;