/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the code for the server to handle the login info sent from the front end. 
*/

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//const session = require("express-session");

router.route("/").post((req, res) => {

    try 
    {   
        const username = req.body.username;
        const enteredPassword = req.body.password;

        User.findOne({username: username}).then(user => {
            
            if (!user){
                
                return res.json({message: "Invalid Login"});
                
            }
            
            const comparePassword = async (password, hash) => {
                try {
                    return await bcrypt.compare(password, hash);
                } catch (error) {
                    console.log(error);
                }

                return false;
            }

            (async () => {
                const passwordHash = user.passwordHash;

                const isValidPass = await comparePassword(password, passwordHash);

                if (isValidPass)
                {
                    req.session.autheticated = true;
                    req.session.user = {
                        username,
                        password
                    }
                    // const token = jwt.sign(
                    //     {
                    //         username: user.username
                    //     },
                    //     'secret123',
                    //     {expiresIn: "1h"}
                    // )

                    // return res.json({message: 'User Authenticated', token: token, expiresIn: 3600, username: user.username})
                    console.log(req.session);
                    return res.json({message: 'User Authenticated'});
                }

                else
                {
                    return res.json({message: "Invalid Login"});
                }
            })();
            

            // else
            // {
            //     console.log(password)
            //     const isPasswordValid = bcrypt.compare(password, user.passwordHash)
            //     console.log(isPasswordValid);
            //     if (isPasswordValid)
            //     {
            //         const token = jwt.sign(
            //             {
            //                 username: user.username
            //             },
            //             'secret123',
            //             {expiresIn: "1h"}
            //         )
            //     return res.json({message: "Invalid Login"});
            // }
            
            const isPasswordValid = bcrypt.compare(enteredPassword, user.passwordHash)

            //         // return res.json({message: 'User Authenticated', token: token, expiresIn: 3600, username: user.username})
            //         return res.json({message: 'User Authenticated', user: token, valid: isPasswordValid});
            //     }

            //     else
            //     {
            //         return res.json({message: "Invalid Login"});
            //     }
            // }
        });

        
    }
    catch (error)
    {
        res.status(500).json({err: error.message || "Error while login"})
    }
})

module.exports = router;