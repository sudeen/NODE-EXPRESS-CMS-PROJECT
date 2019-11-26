const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

// Load Routes
const main = require("./routes/home/main");
const mainAdmin = require("./routes/admin/main-admin");

// Use Routes
app.use("/", main);
app.use("/admin", mainAdmin);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
