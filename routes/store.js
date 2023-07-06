const Controller = require("../controllers");

const route = require("express").Router()

route
  .get("/", Controller.renderStores)
  .get("/:id")
  .get("/:id/products")

module.exports = route;