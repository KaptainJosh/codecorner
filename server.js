/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the code for the backend server of our application. 
*/

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

// app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_CONNECTION_STRING;

// connect to mongoose
mongoose.connect(uri, {useNewUrlParser: true}).then(() => console.log("MongoDb Connected"));

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

//require route
app.use("/", require("./routes/registrationRoute"));
app.use("/", require("./routes/loginRoute"));

if (process.env.NODE_ENV === 'production')
{
    app.use(express.static("client/build"));
}

app.listen(port, function() {
    console.log(`Express server is running on port ${port}`);
});