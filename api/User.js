const express = require("express");
const router = express.Router();

const User = require("./../models/User");

router.use(express.static(__dirname + "./../public"));

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
        res.render("admin.ejs");
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

module.exports = router;
