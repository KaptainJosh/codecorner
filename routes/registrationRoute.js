/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the route to use wehn posting the info for registration. 
*/

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require('bcrypt');

router.route("/").post((req, res) => {

    try 
    {   

        const username = req.body.username;
        const password = req.body.password;

        User.findOne({username: username}).then(user => {
            if (user) {
                return res.json({message: "Username already taken"});
            }

            else 
            {
                const hashPassword = async (password, saltRounds = 10) => {
                    try {
                        salt = await bcrypt.genSalt(saltRounds);

                        return await bcrypt.hash(password, salt);
                    } catch (err) {
                        console.log(error);
                    }

                    return null;
                }
                //bcrypt.hashSync(password, 10);

                (async () => {
                    const passwordHash = await hashPassword(password);

                    if (passwordHash === null)
                    {
                        res.json({message: "Failed to Create User"});
                    }
                    
                    const newUser = new User({
                        username,
                        passwordHash
                    });

                    res.json({username, passwordHash});

                    newUser.save();
                })();

                
            }
        });
    }
    catch (error)
    {
        res.status(500).json({err: error.message || "Error while registration"})
    }
})

module.exports = router;