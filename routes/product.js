const Controller = require("../controllers");
const { middleware } = require("../helpers");

const route = require("express").Router()

route
  .get("/", middleware, Controller.renderProduct)
  .get("/create/:userId", middleware, Controller.addProduct)
  .get("/:productId", middleware, Controller.detailProduct)
  

module.exports = route;