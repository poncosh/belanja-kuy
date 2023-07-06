const Controller = require("../controllers");
const { middleware } = require("../helpers");

const route = require("express").Router()

route
  .use(middleware)
  .get("/", Controller.renderProduct)
  .get("/create/:userId", Controller.addProduct)
  .post("/create/:userId", Controller.saveAddedProduct)
  .get("/:productId/buy/:userId", Controller.buyItem)
  .get("/:productId/cart/:userId",  Controller.addToCart)
  .get("/:productId/deletecart/:userId", Controller.deleteProductFromCart)
  .get("/:productId", Controller.detailProduct)
  

module.exports = route;