if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./db.js");
const UserRouter = require("./api/User");

const User = require("./models/User");

const express = require("express");
const bodyParser = require("express").json;
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

initializePassport(
  passport,
  async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  async (id) => {
    try {
      const user = await User.findOne({ id });
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(bodyParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//ROUTES
app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs", (req, res));
});

app.get("/bio", (req, res) => {
  res.render("bio.ejs", (req, res));
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", (req, res));
});

app.get("/services", (req, res) => {
  res.render("services.ejs", (req, res));
});

app.get("/testimonials", (req, res) => {
  res.render("testimonials.ejs", (req, res));
});

app.get("/services1", (req, res) => {
  res.render("services1.ejs", (req, res));
});

app.get("/services2", (req, res) => {
  res.render("services2.ejs", (req, res));
});

app.get("/service3", (req, res) => {
  res.render("services3.ejs", (req, res));
});

app.get("/dashboard", checkAuthenticated, (req, res) => {
  if (req.user.name === "Admin") {
    res.render("admin.ejs");
  } else {
    res.render("dashboard.ejs", { name: req.user.name });
  }
});

app.get("/admin", checkAuthenticated, (req, res) => {
  console.log(req.user.name);
  if (req.user.name === "Admin") {
    res.render("admin.ejs");
  } else {
    res.render("dashboard.ejs", { name: req.user.name });
  }
});

////////////////////////////////////////////
app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

app.listen(3000);

// app.post("/login", async (req, res) => {
//   try {
//     //const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.push({
//       id: Date.now().toString(),
//       email: req.body.email,
//       password: req.body.password,
//     });
//     console.log(users);
//     res.redirect("/");
//   } catch (e) {
//     console.log(e);
//     res.redirect("/login");
//   }
// });
