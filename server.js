/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the code for the backend server of our application. 
*/

const express = require("express");
const app = express();
// const cors = require("cors");
const mongoose = require('mongoose');
const User = require("./models/userModel");
require("dotenv").config();
//const path = require("path");
const session = require("express-session");
const passport = require("passport");
//const localStrategy = require("passport-local").Strategy;
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const authenticateUser = require("./passportConfig");

const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_CONNECTION_STRING;

// connect to mongoose
mongoose.connect(uri, {useNewUrlParser: true}).then(() => console.log("MongoDb Connected"));

const MongoClient = require('mongodb').MongoClient;
let db;
const url = "mongodb+srv://michael:qP7bDMEL6fVSDLnE@codecorner.tlm8z.mongodb.net/CodeCorner?retryWrites=true&w=majority";

MongoClient.connect(url, (err, client) => {
	if (err) {
		return console.log(err);
	}
	db = client.db("CodeCorner");
    console.log(`Express server is running on port ${port}`)

	app.listen(process.env.PORT || 3001, () => {

	});
});



authenticateUser(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '2mb' }));
 
app.use(
	session({
		secret: process.env.SESSION_SECRET_KEY,
		resave: false, 
		saveUninitialized: false,
		store: MongoStore.create({mongoUrl: process.env.MONGODB_CONNECTION_STRING}),
		cookie: {maxAge: 1000 * 60 * 60 * 24}
	})
)

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// app.use(cors());




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use("/registration", require("./routes/registrationRoute"));

app.post("/login", passport.authenticate('local', {
	successRedirect: '/wall',
	failureRedirect: '/loginFail'
}));

app.get("/wall", (req, res) => {
	//console.log(req.user);
	res.json({message: "User Authenticated"})
})

app.get("/loginFail", (req, res) => {
	res.json({message: "Invalid Login"})
})
//app.use("/login", require("./routes/loginRoute"));
app.get('/makePost', (req, res) => {
	res.sendFile(__dirname + '/public/makePostPrototype.html');
});
app.post('/submitPost', (req, res) => {	
	try {
		db.collection('posts').insertOne(req.body);
	} catch (e) {
		console.log(e);
	}
});

app.get('/getPosts', async (req, res) => {
	let posts = await db.collection('posts').find({}, {}).toArray();
	res.send(posts);
});

app.post("/logout", (req, res) => {
	//console.log(req.user);
	req.logout();
	//console.log(req.user);
	res.json({message: "User Logged Out"});
})

if (process.env.NODE_ENV === 'production')
{
    app.use(express.static("client/build"));
}
// app.use(express.static('public'));
// app.listen(port, function() {
//     console.log(`Express server is running on port ${port}`);
// });

/* Michael's Code*/
//const express = require('express');
//const app = express();


// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log("MongoDB database connection established successfully.");
// })

// app.post("/registration", async (req, res) => {
//     try {

//         const passwordHash = await bcrypt.hash(req.body.password, 10);

//         await User.create({
//             username: req.body.username,
//             passwordHash: passwordHash
//         });

//         res.json({status: 'OK'});
//     }

//     catch(err)
//     {
//         res.json({status: 'error', error: err.message})
//     }
// })

// app.post('/login', async (req, res) => {
//     const user = await User.findOne({username: req.body.username});
//     if (!user)
//     {
//         return { status: 'error', error: 'Invalid Login'}
//     }
//     const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
//     if (isPasswordValid) 
//     {
//         const token = jwt.sign(
//             {
//                 username: user.username
//             },
//             'secret123'
//         )

//         return res.json({status: 'OK', user: token})
//     }

//     else
//     {
//         return res.json({status: 'error', user: false})
//     }
    
// })