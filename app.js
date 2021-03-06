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
const { mongoDbUrl } = require("./config/database");
const passport = require("passport");

mongoose
  .connect(mongoDbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(db => {
    console.log("MONGO DB CONNECTED");
  })
  .catch(error => console.log(error));

app.use(express.static(path.join(__dirname, "public")));

// Set View Engine
const {
  select,
  generateDate,
  paginate,
} = require("./helpers/handlebars-helpers");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "home",
    helpers: { select: select, generateDate: generateDate, paginate: paginate },
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

// PASSPORT

app.use(passport.initialize());
app.use(passport.session());

// Local variables usign middlewares
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

// Load Routes
const main = require("./routes/home/index");
const mainAdmin = require("./routes/admin/main-admin");
const posts = require("./routes/admin/posts");
const categories = require("./routes/admin/categories");
const comments = require("./routes/admin/comments");

// Use Routes
app.use("/", main);
app.use("/admin", mainAdmin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);
app.use("/admin/comments", comments);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
