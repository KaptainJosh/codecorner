/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the code for the backend server of our application. 
*/

const express = require("express");
const app = express();
// const cors = require("cors");
const mongoose = require("mongoose");
//const User = require("./models/userModel");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
//const localStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const authenticateUser = require("./passportConfig");
const path = require("path");
const { ObjectId } = require("mongodb");

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_CONNECTION_STRING;

// connect to mongoose
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("MongoDb Connected"));

const MongoClient = require("mongodb").MongoClient;
let db;
const url =
  "mongodb+srv://michael:qP7bDMEL6fVSDLnE@codecorner.tlm8z.mongodb.net/CodeCorner?retryWrites=true&w=majority";

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("CodeCorner");
  console.log(`Express server is running on port ${port}`);

  app.listen(process.env.PORT || 3001, () => {});
});

authenticateUser(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "2mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/registration", require("./routes/registrationRoute"));

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/wall",
    failureRedirect: "/loginFail",
  })
);

app.post("/likes", (req, res) => {
  //console.log(req.body.id);
  //console.log(req.user);
  const objectId = new ObjectId(req.body.id);
  const username = req.user.username;
  //const userId = req.user.id;

  db.collection("posts")
    .find({ _id: objectId })
    .toArray()
    .then((post) => {
      let usersLiked = post[0].usersLiked; // object that holds the list of users who have liked the post

      if (usersLiked[username] !== true) {
        usersLiked[username] = true;

        db.collection("posts").updateOne(
          { _id: objectId },
          { $set: { usersLiked: usersLiked } },
          (err, result) => {
            if (err) throw err;
            console.log("Finished Updating usersLiked");
          }
        );

        db.collection("posts").updateOne(
          { _id: objectId },
          { $set: { numLikes: req.body.numLikes } },
          (err, result) => {
            if (err) throw err;
            console.log("Finished updating numLikes");
          }
        );

        res.json({ message: "Post Liked" });
      } else {
        delete usersLiked[username];

        db.collection("posts").updateOne(
          { _id: objectId },
          { $set: { usersLiked: usersLiked } },
          (err, result) => {
            if (err) throw err;
            console.log("Finished Updating usersLiked");
          }
        );
        req.body.numLikes -= req.body.numLikes;
        db.collection("posts").updateOne(
          { _id: objectId },
          { $set: { numLikes: req.body.numLikes } },
          (err, result) => {
            if (err) throw err;
            console.log("Finished updating numLikes");
          }
        );
        res.json({ message: "Post Unliked" });
      }
    });
});

app.get("/wall", (req, res) => {
  //console.log(req.user);
  res.json({ message: "User Authenticated" });
});

app.get("/loginFail", (req, res) => {
  res.json({ message: "Invalid Login" });
});
//app.use("/login", require("./routes/loginRoute"));
app.get("/makePost", (req, res) => {
  res.sendFile(__dirname + "/public/makePostPrototype.html");
});
app.post("/submitPost", (req, res) => {
  const post = req.body;
  post["user"] = req.user.username; // adds user's name to the post
  try {
    db.collection("posts").insertOne(req.body);
  } catch (e) {
    console.log(e);
  }
});

app.post("/submitComment", async (req, res) => {
  const postId = req.body["postId"];
  const objectId = new ObjectId(postId);

  let posts = await db
    .collection("posts")
    .find({ _id: objectId }, {})
    .toArray();
  let comments = posts[0]["comments"] || []; //Make empty array just in case post doesn't have comments

  let comment = {
    user: req.user.username,
    content: req.body["content"],
    time: req.body["time"],
  };

  comments.push(comment);

  try {
    db.collection("posts").updateOne(
      { _id: objectId },
      { $set: { comments: comments } }
    );
  } catch (e) {
    console.log(e);
  }
});

app.get("/getPosts", async (req, res) => {
  const postsPerPage = 10;
  const postOffset = req.query.page * postsPerPage;

  let posts = await db
    .collection("posts")
    .find({}, { sort: { time: -1 }, limit: 10, skip: postOffset })
    .toArray();
  res.send(posts);
});

app.get("/getNumPosts", async (req, res) => {
  let posts = await db.collection("posts").find({}, {}).toArray();
  res.send(JSON.stringify({ length: posts.length }));
});

app.get("/getFilteredPosts", async (req, res) => {
  const postsPerPage = 10;
  const postOffset = req.query.page * postsPerPage;
  const tag = req.query.tag;

  let posts = await db
    .collection("posts")
    .find({ tags: tag }, { sort: { time: -1 }, limit: 10, skip: postOffset })
    .toArray();

  res.send(posts);
});

app.get("/getSpecificPost/*", async (req, res) => {
  const postId = req.path.split("/")[2];
  const objectId = new ObjectId(postId);

  let posts = await db
    .collection("posts")
    .find({ _id: objectId }, {})
    .toArray();
  res.send(posts);
});

app.get("/getNumFilteredPosts/:tag", async (req, res) => {
  let tag = req.params.tag;

  let posts = await db.collection("posts").find({ tags: tag }, {}).toArray();

  res.send(JSON.stringify({ length: posts.length }));
});

app.post("/logout", (req, res) => {
  //console.log(req.user);
  req.logout();
  //console.log(req.user);
  res.json({ message: "User Logged Out" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
