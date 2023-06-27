const LocalStrategy = require("passport-local").Strategy;

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUsers = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (user == null) {
        console.log("Not finding the email");
        return done(null, false, { message: "No user found with that email" });
      }

      if (await (password === user.password)) {
        return done(null, user);
      } else {
        console.log("Wrong Password");
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUsers)
  );
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  });
}

module.exports = initialize;
