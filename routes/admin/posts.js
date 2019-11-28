const express = require("express");
const router = express.Router();
const Post = require("../../models/Posts");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
// const path = require("path");

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .then(posts => {
      res.render("admin/posts", { posts: posts });
    })
    .catch(error => console.log("Cannot get all the posts"));
});

router.get("/create", (req, res) => {
  res.render("admin/posts/create");
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
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
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
  Post.findById({ _id: req.params.id })
    .then(post => {
      // console.log("POST", post);
      res.render("admin/posts/edit", { post: post });
    })
    .catch(error => console.log("Cannot get all the posts"));
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;

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
  Post.findOne({ _id: req.params.id }).then(post => {
    fs.unlink(uploadDir + post.file, err => {
      post.deleteOne();
      // console.log("error while deleting", err);
      req.flash("success_message", "Post successfully deleted");
      res.redirect("/admin/posts");
    });
  });
});

module.exports = router;
