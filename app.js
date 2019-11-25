const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

const main = require("./routes/home/main");

app.use("/", main);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
