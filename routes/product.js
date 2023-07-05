const route = require("express").Router()

route
  .get("/")
  .get("/:productId")
  .get("/:productId/add/:userId")

module.exports = route;