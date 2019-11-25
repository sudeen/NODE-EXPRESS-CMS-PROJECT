const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home/index");
});

app.get("/about", (req, res) => {
  res.render("home/about");
});

app.get("/login", (req, res) => {
  res.render("home/login");
});

app.get("/register", (req, res) => {
  res.render("home/register");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
