const express = require("express");
const router = express.Router();

const User = require("./../models/User");

const path = require("path");
router.use(express.static(path.join(__dirname, "/../public")));

router.post("/add", (req, res) => {
  let id = Date.now() + Math.random().toString();
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  User.find({ email })
    .then((result) => {
      if (result.length) {
        res.json({
          status: "FAILED",
          message: "Email already exists",
        });
      } else {
        const newUser = new User({
          id,
          name,
          email,
          password,
        });
        newUser.save();
        res.redirect("/admin");
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occcurred while checking for existing email",
      });
    });
});

router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id).then((user) => {
    const ah = path.join(__dirname, "/../public");
    res.render("edituser.ejs", {
      user: user,
    });
  });
});

router.post("/update/:id", (req, res) => {
  let id = req.params.id;

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  }).then((result) => {
    res.redirect("/admin");
  });
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id).then((result) => {
    if (result.isadmin === false) {
      User.findByIdAndRemove(id).then((result) => {
        res.redirect("/admin");
      });
    }
  });
});

module.exports = router;
