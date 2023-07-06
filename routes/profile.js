const Controller = require("../controllers");
const { middleware } = require("../helpers");

const route = require("express").Router()

route
  .use(middleware)
  .get("/", Controller.renderProfile)
  .get("/cart", Controller.cartUser)
  .get("/checkout", Controller.buyItem)
  .post("/checkout", Controller.checkout)
  .post("/create/:id", Controller.saveProfile)

module.exports = route;