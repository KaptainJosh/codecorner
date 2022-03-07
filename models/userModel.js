/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the model for a user to interface with the mongodb database. 
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;