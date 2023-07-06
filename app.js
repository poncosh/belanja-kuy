const express = require("express");
const app = express();
const port = 8080;
const route = require("./routes");
const path = require("path");
const session = require("express-session");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:false }));
app.use(session({
  secret: 'rahasia banget',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))
app.use(route);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})