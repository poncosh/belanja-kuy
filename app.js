const express = require("express");
const app = express();
const port = 8080;
const route = require("./routes");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:false }));
app.use(route);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})