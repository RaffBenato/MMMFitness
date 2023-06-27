const express = require("express");
const router = express.Router();

const User = require("./../models/User");

router.post("/signup", (req, res) => {
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

        newUser
          .save()
          .then((result) => {
            res.json({
              status: "SUCCESS",
              message: "User registered",
              data: result,
            });
          })
          .catch((err) => {
            res.json({
              status: "FAILED",
              message: "An error occurred while saving user",
            });
          });
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
