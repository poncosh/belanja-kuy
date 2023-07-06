const Controller = require("../controllers");
const { middleware } = require("../helpers");

const route = require("express").Router()

route
  .use(middleware)
  .get("/")
  .get("/cart", Controller.cartUser)
  .get("/checkout", Controller.buyItem)
  .post("/checkout", Controller.checkout)

module.exports = route;