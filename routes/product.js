const Controller = require("../controllers");

const route = require("express").Router()

route
  .get("/", Controller.renderProduct)
  .get("/:productId", Controller.detailProduct)
  .get("/:productId/add/:userId")

module.exports = route;