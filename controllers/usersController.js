const express = require("express");
const app = express();
const userSchema = require('../models/user');
const path = require("path");
const mongoose = require("mongoose");
const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "..", "views"));

const getUsers = async (request, response) => {
    const users = await User.find();
    try {
        response.render('usersView', {
            users
        });
    } catch (error) {
        console.log(error);
    }
};

//Make one user admin and then in the future add the MakeAdmin feature 
async function makeAdmin() {
    const admin = await User.findOne({
        username: "admin"
    });

    admin.isAdmin = true;
    await admin.save();

}



module.exports = {
    getUsers,
    makeAdmin
};