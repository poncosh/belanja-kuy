const route = require("express").Router();
const product = require("./product");
const profile = require("./profile");
const store = require("./store");
const cart = require("./cart");
const Controller = require("../controllers");
const { middleware } = require("../helpers");




route
  .get("/", (req, res) => {
    return res.redirect("/product")
  })
  .get("/login", Controller.loginPage)
  .post("/login", Controller.postLogin)
  .get("/register", Controller.registerUser)
  .post("/register", Controller.postUser)

route.use("/product", product)
route.use("/profile", profile)
route.use("/store", store)
route.use("/cart", cart)

module.exports = route;