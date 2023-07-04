const express = require("express");
const router = express.Router();

const User = require("./../models/User");

const path = require("path");
const { title } = require("process");
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
    if (typeof req.body.isadmin !== "undefined") {
      if (req.body.isadmin === "on") {
        isAdminvar = true;
      } else {
        isadmin = false;
      }
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

router.get("/workout/:id/:title/:type", (req, res) => {
  let titleVar = req.params.title;
  let idVar = req.params.id;
  let typeVar = req.params.type;

  User.findOne({
    _id: idVar,
    workouts: { $elemMatch: { title: titleVar } },
  })
    .then((user) => {
      if (user) {
        const workout = user.workouts.find((w) => w.title === titleVar);
        if (workout) {
          let newWorkout = workout;
          if (typeVar === "admin") {
            res.render("editworkout.ejs", {
              title: newWorkout.title,
              workout: newWorkout.workout,
              user: user,
            });
          } else if (typeVar === "user") {
            res.render("myworkout.ejs", {
              title: newWorkout.title,
              workout: newWorkout.workout,
              user: user,
            });
          }
        } else {
          console.log("Workout not found");
        }
      } else {
        console.log("User not found");
      }
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });
});

router.get("/workouts/:id/:type", (req, res) => {
  let id = req.params.id;
  let type = req.params.type;
  User.findById(id).then((user) => {
    if (type === "admin") {
      res.render("workouts.ejs", {
        user: user,
      });
    } else if (type === "user") {
      res.render("myworkouts.ejs", {
        user: user,
      });
    }
  });
});

router.get("/addworkout/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id).then((user) => {
    res.render("addworkout.ejs", {
      user: user,
    });
  });
});

router.post("/addworkout/:id", (req, res) => {
  let id = req.params.id;
  if (req.body.title === "") {
    return User.findById(id).then((user) => {
      res.render("addworkout.ejs", {
        message: "Enter workout Title.",
        user: user,
      });
    });
  } else {
    const newWorkout = {
      title: req.body.title,
      workout: req.body.workout,
    };

    User.findByIdAndUpdate(id, {
      $push: { workouts: newWorkout },
    })
      .then(() => {
        return User.findById(id);
      })
      .then((user) => {
        res.render("workouts.ejs", {
          user: user,
        });
      });
  }
});

router.post("/workouts/update/:userId/:workoutId", (req, res) => {
  const userId = req.params.userId;
  const workoutId = req.params.workoutId;
  const updatedWorkout = req.body.workout;

  User.findOneAndUpdate(
    { _id: userId, "workouts.title": workoutId },
    { $set: { "workouts.$.workout": updatedWorkout } },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.render("workouts.ejs", {
          user: user,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "An error occurred", error });
    });
});

router.get("/workouts/delete/:userId/:workoutId", (req, res) => {
  const userId = req.params.userId;
  const workoutId = req.params.workoutId;

  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { workouts: { title: workoutId } } },
    { new: true }
  )
    .then((user) => {
      if (user) {
        res.render("workouts.ejs", {
          user: user,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "An error occurred", error });
    });
});

module.exports = router;
