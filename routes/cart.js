const route = require("express").Router()

route
  .get("/")
  .get("/:productId/add/:userId")
  .get("/:productId/delete/:userId")

module.exports = route;