const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");

mongoose
  .connect("mongodb://localhost:27017/cms", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(db => {
    console.log("MONGO DB CONNECTED");
  })
  .catch(error => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
const { select, generateDate } = require("./helpers/handlebars-helpers");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "home",
    helpers: { select: select, generateDate: generateDate },
  }),
);
app.set("view engine", "handlebars");

// Upload Middleware
app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "sudinranjitkar",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  }),
);

app.use(flash());

// Local variables usign middlewares
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  next();
});

// Load Routes
const main = require("./routes/home/index");
const mainAdmin = require("./routes/admin/main-admin");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");

// Use Routes
app.use("/", main);
app.use("/admin", mainAdmin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
