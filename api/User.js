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

  if (name === "" || email === "" || password === "") {
    res.render("adduser.ejs", { message: "Fill out all fields" });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.render("adduser.ejs", { message: "Email already exists." });
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
        res.render("adduser.ejs", { message: "ERROR: " + err });
      });
  }
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
  let postcodeUpperCase;
  let dateOfBirthvar;
  let dateOfStartvar;
  let isAdminvar = false;

  if (
    req.body.name === "" ||
    req.body.email === "" ||
    req.body.password === ""
  ) {
    res.redirect("/admin");
  } else {
    if (typeof req.body.postcode !== "undefined") {
      postcodeUpperCase = req.body.postcode.toUpperCase();
    }
    if (typeof req.body.dateofbirth !== "undefined") {
      dateOfBirthvar = new Date(req.body.dateofbirth);
    }
    if (typeof req.body.startdate !== "undefined") {
      dateOfStartvar = new Date(req.body.startdate);
    }
    if (req.body.isadmin === "on") {
      isAdminvar = true;
    } else {
      isadmin = false;
    }

    User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      dateofbirth: dateOfBirthvar,
      age: req.body.age,
      gender: req.body.gender,
      address: req.body.address,
      city: req.body.city,
      postcode: postcodeUpperCase,
      emergencycontact: req.body.emergencycontact,
      emergencynumber: req.body.emergencynumber,
      startdate: dateOfStartvar,
      isadmin: isAdminvar,
    }).then((result) => {
      res.redirect("/admin");
    });
  }
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

router.get("/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id).then((user) => {
    res.render("user.ejs", {
      user: user,
    });
  });
});

module.exports = router;
