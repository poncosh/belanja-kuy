const Controller = require("../controllers");
const { middleware, isAdmin } = require("../helpers");

const route = require("express").Router()

route
  .use(middleware)
  .get("/", Controller.renderStores)
  .get("/create/:userId", isAdmin, Controller.addStore)
  .post("/create/:userId", Controller.saveAddedStore)
  .get("/:id")
  .get("/:id/products")

module.exports = route;