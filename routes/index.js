const route = require("express").Router();
const product = require("./product");
const profile = require("./profile");
const store = require("./store");
const cart = require("./cart");

route.get("/", (req, res) => {
  return res.redirect("/product")
})

route.use("/product", product)
route.use("/profile", profile)
route.use("/store", store)
route.use("/cart", cart)

module.exports = route;