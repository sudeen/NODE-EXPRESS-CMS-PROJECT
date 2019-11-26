const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cms")
  .then(db => {
    console.log("MONGO DB CONNECTED");
  })
  .catch(error => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

// Load Routes
const main = require("./routes/home/main");
const mainAdmin = require("./routes/admin/main-admin");
const posts = require("./routes/admin/posts");

// Use Routes
app.use("/", main);
app.use("/admin", mainAdmin);
app.use("/admin/posts", posts);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
