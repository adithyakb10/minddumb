import express from "express";
import ejs from "ejs";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy } from "passport-google-oauth20";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import "dotenv/config";
import findOrCreate from "mongoose-findorcreate";
const { Schema } = mongoose;
const GoogleStrategy = Strategy;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Database
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:2717/Users");
  console.log("Connected to the DataBase Successfully");
}

//Schema
const userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
  message: String,
});

//Plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Model
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user._id);
  console.log(user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = User.findById(id).exec();
  console.log(user);
  done(err, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/minddump",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// Routes
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/secrets", (req, res) => {
  res.render("secrets.ejs");
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home.ejs");
  } else {
    res.redirect("/login");
  }
});

//Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/minddump",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  main();
});
