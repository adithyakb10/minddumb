import express from "express";
import ejs from "ejs";
import session from "express-session";
import MongoStore from "connect-mongo";
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
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    cookie: { maxAge: 86400000 },
    resave: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.eyuetfl.mongodb.net/Users?retryWrites=true`,
      collectionName: "sessions",
      dbName: "Users",
    }),
    secret: process.env.SECRET,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Database

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.eyuetfl.mongodb.net/Users?retryWrites=true&w=majority`
      // "mongodb://localhost:2717/"
    );
    console.log("Connected to the DataBase Successfully");
  } catch (err) {
    console.log(err);
  }
}

//Schema
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,
  picture: String,
  messages: Array,
  privateMessages: Array,
});

//Plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//Model
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    const user = await User.findById(id);
    done(err, user);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://minddump.onrender.com:3000/auth/google/minddump",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      User.findOrCreate(
        {
          googleId: profile.id,
          name: profile.name.givenName,
          picture: profile._json.picture,
          username: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// Routes
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/logout", (req, res) => {
  // Destroy the session on the server
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Clear the session cookie on the client-side
      res.clearCookie("connect.sid"); // Use the custom session cookie name
      res.redirect("/login"); // Redirect to the login page or any other page after logout
    }
  });
});

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.user.id).exec();
    res.render("home.ejs", { user: user });
  } else {
    res.redirect("/login");
  }
});

//Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

app.get(
  "/auth/google/minddump",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/secrets", async (req, res) => {
  console.log("hello");
  try {
    console.log("hello");
    const users = await User.find({ messages: { $ne: null } }).exec();
    console.log(users);
    if (users) {
      console.log(users);
      res.render("secrets.ejs", { users: users });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/submit", async (req, res) => {
  try {
    const message = req.body.thought;
    const user = await User.findById(req.user.id).exec();
    // console.log(user);
    const date = new Date();
    const formattedDate = date.toLocaleString();

    //if message is private
    if (req.body.isPrivate) {
      user.privateMessages.push({ message, formattedDate });
      await user.save();
      res.redirect("/");
    }
    // if message is public
    else {
      user.messages.push({ message, formattedDate });
      await user.save();
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  main();
});
