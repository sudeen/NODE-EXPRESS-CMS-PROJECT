const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
// const path = require("path");
const { userAuthenticated } = require("../../helpers/authentication");

router.all("/*", userAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .populate("category")
    .then(posts => {
      res.render("admin/posts", { posts: posts });
    })
    .catch(error => console.log("Cannot get all the posts"));
});

router.get("/create", (req, res) => {
  Category.find({}).then(categories => {
    res.render("admin/posts/create", { categories: categories });
  });
});

router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: "please add a title" });
  }

  if (!req.body.body) {
    errors.push({ message: "please add a description" });
  }

  if (errors.length > 0) {
    res.render("admin/posts/create", {
      errors: errors,
    });
  } else {
    let fileName = "LAMBORGINI.jpg";

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      fileName = Date.now() + "-" + file.name;

      file.mv("./public/uploads/" + fileName, err => {
        if (err) throw err;
      });
    }

    let allowComments = true;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      category: req.body.category,
      file: fileName,
    });
    newPost
      .save()
      .then(savedPost => {
        // console.log(savedPost);
        req.flash("success_message", "Post was created successfully");
        res.redirect("/admin/posts");
      })
      .catch(error => console.log("Could not save the post"));
  }
});

router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    Category.find({}).then(categories => {
      res.render("admin/posts/edit", { post: post, categories: categories });
    });
  });
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    post.user = req.user.id;
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    post.category = req.body.category;

    if (!isEmpty(req.files)) {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;
      post.file = filename;

      file.mv("./public/uploads/" + filename, err => {
        if (err) throw err;
      });
    }
    post.save().then(updatedPost => {
      req.flash("success_message", "Post was successfully updated");
      res.redirect("/admin/posts");
    });
  });
});

router.delete("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("comments")
    .then(post => {
      fs.unlink(uploadDir + post.file, err => {
        if (!post.comments.length < 1) {
          post.comments.forEach(comment => {
            comment.deleteOne();
          });
        }
        post.deleteOne().then(postRemoved => {
          req.flash("success_message", "Post successfully deleted");
          res.redirect("/admin/posts");
        });
        // console.log("error while deleting", err);
      });
    });
});

module.exports = router;
