const mongoose = require("mongoose");
const userSchema = require("../models/user");
const User = mongoose.model('User', userSchema)


const signup = async (request, response) => {

    try {
        const {
            username,
            password
        } = request.body;
        const newUser = new User({
            username,
            password
        });

        const existingUser = await User.findOne({
            username
        });
        if (existingUser) {
            console.log("Existing User: ", existingUser);
            return response.status(409).json({
                error: "User exists try to log in!"
            });
        }
        await newUser.save();
        console.log("New User Added: ", newUser);
        response.status(201).json({
            message: "Sign Up Successful"
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            error: "Server Error"
        });
    }
};

module.exports = {
    signup
};