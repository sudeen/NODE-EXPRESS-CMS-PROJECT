const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const Category = require("../../models/Category");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .then(posts => {
      Category.find({}).then(categories => {
        res.render("home/index", { posts: posts, categories: categories });
      });
    })
    .catch(error => console.log("Cannot get all the posts"));
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

router.post("/register", (req, res) => {
  let errors = [];

  if (!req.body.firstName) {
    errors.push({ message: "please add a First Name" });
  }

  if (!req.body.lastName) {
    errors.push({ message: "please add a Last Name" });
  }

  if (!req.body.email) {
    errors.push({ message: "please add an email" });
  }
  if (!req.body.password) {
    errors.push({ message: "please add a passoword" });
  }
  if (!req.body.passwordConfirm) {
    errors.push({ message: "This field cannot be empty" });
  }

  if (req.body.password !== req.body.passwordConfirm) {
    errors.push({ message: "Passwords don't match" });
  }

  if (errors.length > 0) {
    res.render("home/register", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        let newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save().then(savedUser => {
              req.flash("success_message", "User registered, Please login");
              res.redirect("/login");
            });
            // console.log(hash);
          });
        });
      } else {
        req.flash("error_message", "Email already exists please login");
        res.redirect("/login");
      }
    });
  }
});

router.get("/post/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    Category.find({}).then(categories => {
      res.render("home/post", { post: post, categories: categories });
    });
  });
});

module.exports = router;
