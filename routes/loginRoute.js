/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the code for the server to handle the login info sent from the front end. 
*/

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.route("/login").post((req, res) => {

    try 
    {   
        const username = req.body.username;
        const enteredPassword = req.body.password;

        User.findOne({username: username}).then(user => {
            
            if (!user){
                
                return res.json({message: "Invalid Login"});
                
            }
            // console.log("Password" + password);
            // console.log("User.password" + user.passwordHash);
            // let mes = "";
            // bcrypt.compare(password, user.passwordHash, (err, res) => {
            //     if (res) 
            //     {
            //         mes = 'User Authenticated';
                    
            //     }
            //     console.log(res);
            // })
            // console.log(mes);
            // if (mes === "User Authenticated")
            // {
            //     return res.json({message: 'User Authenticated'});
            // }

            // else
            // {
            //     return res.json({message: "Invalid Login"});
            // }
            
            const isPasswordValid = bcrypt.compare(enteredPassword, user.passwordHash)

            if (isPasswordValid)
            {
                // const token = jwt.sign(
                //     {
                //         username: user.username
                //     },
                //     'secret123',
                //     {expiresIn: "1h"}
                // )

                // return res.json({message: 'User Authenticated', token: token, expiresIn: 3600, username: user.username})
                return res.json({message: 'User Authenticated'});
            }
        });

        
    }
    catch (error)
    {
        res.status(500).json({err: error.message || "Error while login"})
    }
})

module.exports = router;