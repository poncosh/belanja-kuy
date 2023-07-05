const route = require("express").Router()

route
  .get("/")
  .get("/edit")
  .post("/edit")

module.exports = route;