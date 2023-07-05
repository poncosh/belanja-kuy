const route = require("express").Router()

route
  .get("/")
  .get("/:id")
  .get("/:id/products")

module.exports = route;