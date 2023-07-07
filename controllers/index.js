const { User, Store, Product, Rating, ShoppingCart, ShoppingCartItem, UserProfile, sequelize } = require("../models");
const { Op, QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs")
const formatPrice = require("../helpers/formatPrice.js");
const {Checkout} = require("checkout-sdk-node");

class Controller {
  static renderProfile(req, res) {
    User
      .findOne({
        where: {
          id: req.session.userId
        },
        include: {
          model: UserProfile
        }
      })
      .then(suc => {
        if(!suc.UserProfile) {
          res.render("MakeYourProfile", { errors: req.query.errors ? req.query.errors : false, id: req.session.userId })
        } else {
          res.render("UserProfile", { errors: req.query.errors ? req.query.errors : false, suc })
        }
      })
  }
  static loginPage(req, res) {
    res.render("Login", { errors: req.query.errors ? req.query.errors : false,  })
  }

  static saveProfile(req, res) {
    const { first_name, last_name, address, profile_picture, date_of_birth } = req.body;

    const newUsProfile = {
      first_name,
      last_name,
      address,
      profile_picture,
      date_of_birth,
      UserId: req.session.userId
    }
    UserProfile
      .create(newUsProfile)
      .then(suc => res.redirect("/"))
      .catch(err => {
        if(err.name === "SequelizeValidationError") {
          const errArray = [];
          err.errors.map(el => errArray.push(el.message));
          return res.redirect(`profile/?errors=${errArray}`)
        } else {
          return res.send(err)
        }
      })
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
    .catch(err => {
      if(err.name === "SequelizeValidationError") {
        const errArray = [];
        err.errors.map(el => errArray.push(el.message));
        return res.redirect(`/login?errors=${errArray}`)
      } else {
        return res.send(err)
      }
    })
  }

  static registerUser(req, res) {
    res.render("Register", { errors: req.query.errors ? req.query.errors : false,  })
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
      .catch(err => {
        if(err.name === "SequelizeValidationError") {
          const errArray = [];
          err.errors.map(el => errArray.push(el.message));
          return res.redirect(`/register?errors=${errArray}`)
        } else {
          return res.send(err)
        }
      })
  }

  static editProfile(req, res) {
    UserProfile
      .findOne({
        where: {
          UserId: req.session.userId
        }
      })
      .then(suc => res.render("EditProfile", { errors: req.query.errors ? req.query.errors : false, profile: suc }))
      .catch(err => {
        if(err.name === "SequelizeValidationError") {
          const errArray = [];
          err.errors.map(el => errArray.push(el.message));
          return res.redirect(`/profile/edit?errors=${errArray}`)
        } else {
          return res.send(err)
        }
      })
  }

  static saveEditedProfile(req, res) {
    const { first_name, last_name, address, profile_picture, date_of_birth } = req.body;

    UserProfile
      .update({
        first_name,
        last_name,
        address,
        profile_picture,
        date_of_birth
      }, {
        where: {
          UserId: req.session.userId
      }})
      .then(suc => res.redirect("/"))
      .catch(err => {
        if(err.name === "SequelizeValidationError") {
          const errArray = [];
          err.errors.map(el => errArray.push(el.message));
          return res.redirect(`/profile/edit?errors=${errArray}`)
        } else {
          return res.send(err)
        }
      })
  }

  static renderProduct(req, res) {
    sequelize
      .query(`SELECT "Product".*, "Stores"."store_name", AVG(COALESCE("Ratings".rating, 0)) AS "avg_rating" FROM "Products" AS "Product" LEFT JOIN "Ratings" AS "Ratings" ON "Product"."id" = "Ratings"."ProductId" JOIN "Stores" ON "Product"."StoreId" = "Stores"."id" GROUP BY "Product"."id", "Stores"."id";`, { type: QueryTypes.SELECT }
      )
      .then(products => res.render("Product", { errors: req.query.errors ? req.query.errors : false, id: req.session.userId, products}))
      .catch(err => console.log(err))
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
        console.log(products);
        let rating = products.dataValues.Ratings;
        res.render("DetailProduct", { id: req.session.userId ? req.session.userId : false, products, rating, formatPrice });
        // res.send(products);
      })
      .catch((err) => console.log(err));
  }

  static renderStores(req, res) {
    sequelize
      .query(`SELECT "Store"."id", "Store"."store_name", "Store"."location", "Store"."description", "Store"."product_sold", "Store"."account_number", "Store"."createdAt", "Store"."updatedAt", CAST(SUM("Products".stock) AS INTEGER) AS total_stock FROM "Stores" AS "Store" LEFT OUTER JOIN "Products" AS "Products" ON "Store"."id" = "Products"."StoreId" GROUP BY "Store"."id"`, { type: QueryTypes.SELECT })
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
      if(user.Store) {
        const errorMesage = "Anda sudah memiliki store!"
        res.redirect(`/store?errors=${errorMesage}`)
      } else {
        res.render("AddStore", { errors: req.query.errors ? req.query.errors : false, id: userId, user })
      }
    })
    .catch(err => res.send(err))

  }

  static saveAddedStore(req, res) {
    const { store_name, location, description, product_sold, account_number } = req.body;
    
    const newStore = {
      store_name: store_name,
      location: location,
      description: description,
      product_sold: product_sold,
      account_number: account_number,
      UserId: req.session.userId
    }

    Store
      .create(newStore)
      .then(success => res.redirect("/store"))
      .catch(err => {
        if(err.name === "SequelizeValidationError") {
          const errArray = [];
          err.errors.map(el => errArray.push(el.message));
          return res.redirect(`/store/create/${req.session.userId}?errors=${errArray}`)
        } else {
          return res.send(err)
        }
      })
  }

  static saveAddedProduct(req, res) {
    const UserId = req.session.userId;
    const { product_name, stock, price, image_url } = req.body

    Store.findOne({
      where: {
        UserId
      }
    })
    .then(store => {
      const newProduct = {
        product_name,
        stock,
        price,
        image_url,
        StoreId: store.id
      }
      return Product.create(newProduct)
    })
    .then(suc => res.redirect("/product"))
    .catch(err => {
      if(err.name === "SequelizeValidationError") {
        const errArray = [];
        err.errors.map(el => errArray.push(el.message));
        return res.redirect(`/product/create/${req.session.userId}?errors=${errArray}`)
      } else {
        return res.send(err)
      }
    })
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
          res.render("AddProduct", { id: req.session.userId, errors: req.query.errors ? req.query.errors : false, data })
        }
      })
      .catch(err => console.log(err))
  }

  static addToCart(req, res) {
    const { productId, userId } = req.params;
    const UserId = userId;
    const ProductId = productId;
    let ShoppingCartId;
    const thisDate = new Date().toISOString().split('T')[0];
    let totalShop;

    sequelize.query(`INSERT INTO "ShoppingCarts"("UserId", summary_shop, "createdAt", "updatedAt") SELECT $1, 0, '${thisDate}', '${thisDate}' WHERE NOT EXISTS (SELECT "UserId" FROM "ShoppingCarts" WHERE "UserId" = $1);`, { bind: [UserId] })
      .then(success => {
        return ShoppingCart.findOne({where:{UserId:userId}})
      })
      .then(success => {
        ShoppingCartId = success.id;
        return sequelize.query(`INSERT INTO "ShoppingCartItems"("ProductId", "ShoppingCartId", "quantity", "createdAt", "updatedAt") SELECT $1, $2, 0,   '${thisDate}', '${thisDate}' WHERE NOT EXISTS (SELECT "ProductId" FROM "ShoppingCartItems" WHERE "ProductId" = $1)`, { bind: [ProductId, success.id] })
      })
      .then(success => {
        return ShoppingCartItem.findOne({
          where: {
            ShoppingCartId: ShoppingCartId,
            ProductId: ProductId
          }
        })
      })
      .then(shoppinCartItem => {
        console.log(shoppinCartItem);
        shoppinCartItem.increment('quantity')
        return Product.findByPk(productId)
      })
      .then(product => {
        product.decrement('stock')
        return sequelize.query(`UPDATE "ShoppingCarts" SET summary_shop = summary_shop + $1 WHERE "UserId" = $2`, { bind: [product.price, UserId]})
      })
      .then(success => {
        return res.redirect(`/product/${productId}`)
      })
      .catch(err => console.log(err))
  }

  static cartUser(req, res) {
    const { userId } = req.session;
    const UserId = userId
    let cart;

    sequelize.query(`SELECT "Users".id, "Users".username, "ShoppingCartItems"."quantity", "Products"."product_name", "Products"."image_url", "Products".stock, "Products".id AS "prod_id", "Products".price FROM "Users" JOIN "ShoppingCarts" ON "Users".id = "ShoppingCarts"."UserId" JOIN "ShoppingCartItems" ON "ShoppingCarts".id = "ShoppingCartItems"."ShoppingCartId" JOIN "Products" ON "ShoppingCartItems"."ProductId" = "Products".id WHERE "Users".id = ${req.session.userId}`, { type: QueryTypes.SELECT })
    .then(success => {
      cart = success;
      return ShoppingCart
        .findOne({
          raw: true,
          where: {
            UserId
          }
        })
    })
    .then(summary => {
      if (summary === undefined) {
        return res.send('Belum pesan barang!')
      }
      return res.render("Cart", { formatPrice, errors: req.query.errors ? req.query.errors : false, cart, summariesPayment: summary.summary_shop })
    })
    .catch(err => res.send(err))
  }

  static buyItem(req, res) {
    const { userId } = req.session;
    let summariesPayment;

    ShoppingCart
      .findOne({
        where: {
          UserId: userId
        }
      })
      .then(summaryShop => {
        summariesPayment = summaryShop.summary_shop;
        return sequelize.query(`SELECT "Users".username, "ShoppingCartItems"."quantity", "Products"."product_name", "Products"."image_url", "Products".stock, "Products".id AS "prod_id", "Products".price FROM "Users" JOIN "ShoppingCarts" ON "Users".id = "ShoppingCarts"."UserId" JOIN "ShoppingCartItems" ON "ShoppingCarts".id = "ShoppingCartItems"."ShoppingCartId" JOIN "Products" ON "ShoppingCartItems"."ProductId" = "Products".id WHERE "Users".id = ${req.session.userId}`, { type: QueryTypes.SELECT })
      })
      .then(detailShop => {
        res.render  ("PayMent", { formatPrice, errors: req.query.errors ? req.query.errors : false,summariesPayment, detailShop })
      })
  }
  
  static deleteProductFromCart(req, res) {
    const { userId } = req.session;
    const { productId } = req.params;
    let shoppingCartId;
    let shoppingCartVal;
    
    ShoppingCart.findOne({where:{UserId:userId}})
      .then(success => {
        shoppingCartVal = success.summary_shop;
        shoppingCartId = success.id;
        return sequelize.query(`SELECT "Products"."price" * "ShoppingCartItems".quantity AS "delete" FROM "ShoppingCartItems" JOIN "Products" ON "ShoppingCartItems"."ProductId" = "Products".id WHERE "Products".id = $1 AND "ShoppingCartItems"."ShoppingCartId" = $2`, {bind: [productId, shoppingCartId]}, { type: QueryTypes.SELECT })
      })
      .then(success => {
        console.log(success);
        return sequelize.query(`UPDATE "ShoppingCarts" SET summary_shop = summary_shop - $1 WHERE "UserId" = $2`, { bind: [success[0][0].delete, userId]})
      })
      .then(success => {
        return sequelize.query(`DELETE FROM "ShoppingCartItems" WHERE "ShoppingCartId" = $1 AND "ProductId" = $2`, {bind: [shoppingCartId, productId]})
      })
      .then(success => res.redirect(`/product/${productId}/cart/${userId}`))
      .catch(err => console.log(err))
  }

  static checkout(req, res) {
    const { number, expiry_month, expiry_year, cvv, amount } = req.body;

    const cko = new Checkout('sk_test_3e1ad21b-ac23-4eb3-ad1f-375e9fb56481');

    const successMessage = `Selamat, transaksi anda berhasil!`

    cko.payments.request({
      source: {
          number: number,
          expiry_month: Number(expiry_month),
          expiry_year: Number(expiry_year),
          cvv: cvv
      },
      currency: 'IDR',
      amount: Number(amount)
  })
  .then(transaction => {
    if(transaction.status === "Declined") {
      return res.send("Maaf, transaksi gagal")
    }
    return ShoppingCart.findOne({
      where: {
        UserId: req.session.userId
      }
    })
  })
  .then(shoppingcartid => {
    return sequelize.query(`DELETE FROM "ShoppingCartItems" WHERE "ShoppingCartItems"."ShoppingCartId" = $1`, { bind: [shoppingcartid.id]})
  })
  .then(success => {
    return sequelize.query(`DELETE FROM "ShoppingCarts" WHERE "ShoppingCarts"."UserId" = $1`, {bind: [req.session.userId]})
  })
  .then(success => {
    return res.redirect(`/product?errors=${successMessage}`)
  })
  .catch(err => {
    return console.log(err)
  })
  }

  static detailStore(req, res) {
    const { id } = req.params;

    Store
      .findByPk(id)
      .then(suc => res.render("StoreDetail", { suc }))
  }
}

module.exports = Controller;